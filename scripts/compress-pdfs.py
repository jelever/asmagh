"""Losslessly compress specification-sheet PDFs for the website, and prove it.

Usage (Python 3.10+, `pip install pymupdf pillow`):

    python scripts/compress-pdfs.py "../../assets/asmagh/Specification sheet papers" src/assets/docs

For every PDF in the source folder this writes a compressed copy to the
target folder, then renders every page of both at 200 dpi and compares them
pixel by pixel, and compares the extracted text. It exits non-zero if any
page differs, so a copy is never kept unless it is identical.

What it does (no image is re-encoded or downsampled):
  - subset embedded fonts to the glyphs actually used;
  - merge duplicate objects (garbage=4) and drop unused ones;
  - clean and re-deflate content streams, pack objects into object streams.

The source folder holds the client's originals and is never modified.
"""

import os
import sys

import pymupdf
from PIL import Image, ImageChops


def compress(src: str, dst: str) -> None:
    doc = pymupdf.open(src)
    doc.subset_fonts()
    doc.save(dst, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, clean=True, use_objstms=1)


def identical(a_path: str, b_path: str) -> bool:
    a, b = pymupdf.open(a_path), pymupdf.open(b_path)
    if len(a) != len(b):
        return False
    for i in range(len(a)):
        pa, pb = a[i].get_pixmap(dpi=200), b[i].get_pixmap(dpi=200)
        ia = Image.frombytes("RGB", (pa.width, pa.height), pa.samples)
        ib = Image.frombytes("RGB", (pb.width, pb.height), pb.samples)
        if ia.size != ib.size or ImageChops.difference(ia, ib).getbbox() is not None:
            return False
    text = lambda d: "".join(p.get_text() for p in d)
    return text(a) == text(b)


def main(src_dir: str, dst_dir: str) -> int:
    os.makedirs(dst_dir, exist_ok=True)
    failed = 0
    total_in = total_out = 0
    for name in sorted(os.listdir(src_dir)):
        if not name.lower().endswith(".pdf"):
            continue
        src, dst = os.path.join(src_dir, name), os.path.join(dst_dir, name)
        compress(src, dst)
        ok = identical(src, dst)
        a, b = os.path.getsize(src), os.path.getsize(dst)
        total_in += a
        total_out += b
        print(f"{'OK  ' if ok else 'DIFF'} {name}: {a / 1e6:.2f} MB -> {b / 1e6:.2f} MB (-{100 - 100 * b / a:.0f}%)")
        if not ok:
            os.remove(dst)
            failed += 1
    if total_in:
        print(f"Total {total_in / 1e6:.1f} MB -> {total_out / 1e6:.1f} MB (-{100 - 100 * total_out / total_in:.0f}%)")
    if failed:
        print(f"{failed} file(s) differed after compression and were NOT written.")
    return 1 if failed else 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2]))
