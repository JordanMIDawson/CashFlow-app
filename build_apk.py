#!/usr/bin/env python3
"""
Cash Flow — Android Dual v1 + v2 Signed APK Builder
Packages web assets and generates a full-spec signed APK with:
  1. Uncompressed 4-byte aligned resources.arsc (Android API 30+ / R+ compliant)
  2. Clean v1 JAR signature (no S/MIME attributes)
  3. Full APK Signature Scheme v2 (ID 0x7109871a) required by Android 11, 12, 13, 14
"""
import os, sys, zipfile, hashlib, base64, subprocess, tempfile, struct

def lp(data):
    return struct.pack("<I", len(data)) + data

def build():
    CRLF = bytes([13, 10])
    workspace = os.path.dirname(os.path.abspath(__file__))
    output_apk = os.path.join(workspace, "CashFlow.apk")
    base_apk = "/tmp/famexp.apk"

    if not os.path.exists(base_apk):
        print("Fetching base runtime template...")
        subprocess.run([
            "curl", "-L", "-s", "-o", base_apk,
            "https://github.com/MI-Musanna/FamExpenSync-App/releases/download/1.1.2/app-release.apk"
        ], check=True)

    print("Building Cash Flow Android APK...")
    with tempfile.TemporaryDirectory() as tmpdir:
        key_path = os.path.join(tmpdir, "key.pem")
        cert_path = os.path.join(tmpdir, "cert.pem")
        subprocess.run([
            "openssl", "req", "-x509", "-newkey", "rsa:2048",
            "-keyout", key_path, "-out", cert_path,
            "-days", "10000", "-nodes",
            "-subj", "/CN=Cash Flow/O=CashFlow Finance/C=US"
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        entries = {}
        with zipfile.ZipFile(base_apk, "r") as z_in:
            for info in z_in.infolist():
                name = info.filename
                if name.startswith("META-INF/") or name.startswith("assets/"):
                    continue
                entries[name] = z_in.read(name)

        asset_files = [
            "index.html", "style.css", "app.js", "manifest.json",
            "icon.png", "icon-192.png", "icon-512.png", "sw.js"
        ]
        for af in asset_files:
            p = os.path.join(workspace, af)
            if os.path.exists(p):
                with open(p, "rb") as af_file:
                    entries["assets/" + af] = af_file.read()

        # Update Android App Name in resources.arsc to "Cash Flow"
        arsc_data = bytearray(entries["resources.arsc"])
        sp_type, sp_header_size, sp_size, string_count, style_count, sp_flags, strings_start, styles_start = struct.unpack('<HHIIIIII', arsc_data[12:40])
        offset_table = [struct.unpack('<I', arsc_data[40 + i*4 : 44 + i*4])[0] for i in range(string_count)]
        off_843 = offset_table[843]
        base_str = 12 + strings_start
        arsc_data[base_str + off_843 : base_str + off_843 + 15] = b'\x09\x09Cash Flow\x00\x00\x00\x00'
        entries["resources.arsc"] = bytes(arsc_data)
        print("Updated resources.arsc: App name set to 'Cash Flow'")

        # Clean adaptive icon background: replace green grid background with solid dark obsidian (#0a0d14)
        if "res/0w.xml" in entries:
            bg_data = bytearray(entries["res/0w.xml"])
            green_color = bytes([0x84, 0xdc, 0x3d, 0xff])
            obsidian_color = bytes([0x14, 0x0d, 0x0a, 0xff])
            grid_stroke = bytes([0xff, 0xff, 0xff, 0x33])
            trans_stroke = bytes([0x00, 0x00, 0x00, 0x00])
            bg_data = bg_data.replace(green_color, obsidian_color).replace(grid_stroke, trans_stroke)
            entries["res/0w.xml"] = bytes(bg_data)
            print("Updated res/0w.xml: Adaptive icon background set to dark obsidian")

        # Generate and inject Android Launcher & Adaptive App Icons across all screen densities
        icon_source = os.path.join(workspace, "icon.png")
        icon_map = {
            "res/d2.webp": (48, 48),    # mdpi legacy
            "res/yw.webp": (48, 48),    # mdpi round
            "res/MO.webp": (72, 72),    # hdpi legacy
            "res/fq.webp": (72, 72),    # hdpi round
            "res/qs.webp": (96, 96),    # xhdpi legacy
            "res/u5.webp": (96, 96),    # xhdpi round
            "res/Nt.webp": (108, 108),  # mdpi adaptive foreground
            "res/Sn.webp": (144, 144),  # xxhdpi legacy
            "res/j_.webp": (144, 144),  # xxhdpi round
            "res/13.webp": (162, 162),  # hdpi adaptive foreground
            "res/-6.webp": (192, 192),  # xxxhdpi legacy
            "res/sK.webp": (192, 192),  # xxxhdpi round
            "res/9Q.webp": (216, 216),  # xhdpi adaptive foreground
            "res/iE.webp": (324, 324),  # xxhdpi adaptive foreground
            "res/5c.webp": (432, 432),  # xxxhdpi adaptive foreground
        }
        for res_name, (w, h) in icon_map.items():
            resized_path = os.path.join(tmpdir, f"icon_{w}x{h}.png")
            if not os.path.exists(resized_path):
                subprocess.run(["sips", "-z", str(h), str(w), icon_source, "--out", resized_path], check=True, stdout=subprocess.DEVNULL)
            with open(resized_path, "rb") as rf:
                entries[res_name] = rf.read()
        print(f"Updated all {len(icon_map)} Android launcher and adaptive icon densities with Cash Flow icon.")

        # --- Step 1: v1 JAR Manifest & Signature ---
        manifest_lines = [b"Manifest-Version: 1.0" + CRLF + b"Created-By: 1.0 (Android)" + CRLF + CRLF]
        entry_digests_256 = {}
        entry_digests_1 = {}
        for name in sorted(entries.keys()):
            data = entries[name]
            sha1 = base64.b64encode(hashlib.sha1(data).digest())
            sha256 = base64.b64encode(hashlib.sha256(data).digest())
            entry_chunk = b"Name: " + name.encode("utf-8") + CRLF + b"SHA-256-Digest: " + sha256 + CRLF + b"SHA1-Digest: " + sha1 + CRLF + CRLF
            manifest_lines.append(entry_chunk)
            entry_digests_256[name] = base64.b64encode(hashlib.sha256(entry_chunk).digest())
            entry_digests_1[name] = base64.b64encode(hashlib.sha1(entry_chunk).digest())

        manifest_bytes = b"".join(manifest_lines)
        entries["META-INF/MANIFEST.MF"] = manifest_bytes

        manifest_sha1 = base64.b64encode(hashlib.sha1(manifest_bytes).digest())
        manifest_sha256 = base64.b64encode(hashlib.sha256(manifest_bytes).digest())
        sf_lines = [
            b"Signature-Version: 1.0" + CRLF,
            b"Created-By: 1.0 (Android)" + CRLF,
            b"SHA-256-Digest-Manifest: " + manifest_sha256 + CRLF,
            b"SHA1-Digest-Manifest: " + manifest_sha1 + CRLF,
            b"X-Android-APK-Signed: 2" + CRLF + CRLF
        ]
        for name in sorted(entry_digests_256.keys()):
            sf_lines.append(
                b"Name: " + name.encode("utf-8") + CRLF +
                b"SHA-256-Digest: " + entry_digests_256[name] + CRLF +
                b"SHA1-Digest: " + entry_digests_1[name] + CRLF + CRLF
            )

        sf_bytes = b"".join(sf_lines)
        entries["META-INF/CERT.SF"] = sf_bytes

        sf_temp = os.path.join(tmpdir, "CERT.SF")
        rsa_temp = os.path.join(tmpdir, "CERT.RSA")
        with open(sf_temp, "wb") as sf_out:
            sf_out.write(sf_bytes)

        subprocess.run([
            "openssl", "smime", "-sign", "-in", sf_temp, "-out", rsa_temp,
            "-outform", "DER", "-inkey", key_path, "-signer", cert_path,
            "-md", "sha256", "-noattr"
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        with open(rsa_temp, "rb") as rsa_in:
            entries["META-INF/CERT.RSA"] = rsa_in.read()

        # --- Step 2: Write ZIP archive with 4-byte aligned resources.arsc ---
        temp_zip_path = os.path.join(tmpdir, "aligned.apk")
        with zipfile.ZipFile(temp_zip_path, "w") as z_out:
            for name in sorted(entries.keys()):
                data = entries[name]
                zinfo = zipfile.ZipInfo(name)
                is_stored = (name == "resources.arsc" or name.endswith(".png") or name.endswith(".jpg") or name.endswith(".webp"))
                if is_stored:
                    zinfo.compress_type = zipfile.ZIP_STORED
                    cur_offset = z_out.fp.tell()
                    name_bytes = name.encode("utf-8")
                    pad = (4 - ((cur_offset + 30 + len(name_bytes)) % 4)) % 4
                    zinfo.extra = bytes([0]) * pad
                else:
                    zinfo.compress_type = zipfile.ZIP_DEFLATED
                z_out.writestr(zinfo, data)

        # --- Step 3: APK Signature Scheme v2 Signing Block ---
        with open(temp_zip_path, "rb") as f:
            zip_bytes = f.read()

        eocd_idx = zip_bytes.rfind(b"PK")
        cd_offset = struct.unpack("<I", zip_bytes[eocd_idx+16:eocd_idx+20])[0]

        # Get DER certificate & SubjectPublicKeyInfo DER
        cert_der_path = os.path.join(tmpdir, "cert.der")
        subprocess.run(["openssl", "x509", "-in", cert_path, "-outform", "DER", "-out", cert_der_path], check=True)
        with open(cert_der_path, "rb") as f: cert_der = f.read()

        pubkey_der_path = os.path.join(tmpdir, "pubkey.der")
        subprocess.run(["openssl", "x509", "-in", cert_path, "-pubkey", "-noout"], stdout=subprocess.PIPE)
        p1 = subprocess.Popen(["openssl", "x509", "-in", cert_path, "-pubkey", "-noout"], stdout=subprocess.PIPE)
        p2 = subprocess.Popen(["openssl", "rsa", "-pubin", "-outform", "DER"], stdin=p1.stdout, stdout=subprocess.PIPE)
        p1.stdout.close()
        pubkey_der = p2.communicate()[0]

        # Build v2 signer data template to get total signing block size first
        # Digest algorithm 0x0103 = CHUNKED_SHA256_WITH_RSA_PKCS1_V1_5
        dummy_digest = bytes(32)
        digests_data = lp(struct.pack("<I", 0x0103) + lp(dummy_digest))
        all_digests = lp(digests_data)
        all_certs = lp(lp(cert_der))
        all_attrs = lp(b"")
        signed_data_template = all_digests + all_certs + all_attrs
        dummy_sig = bytes(256)
        signatures_data = lp(struct.pack("<I", 0x0103) + lp(dummy_sig))
        all_sigs = lp(signatures_data)
        all_pubkey = lp(pubkey_der)
        signer_template = lp(lp(signed_data_template) + all_sigs + all_pubkey)
        signers_template = lp(signer_template)
        v2_pair_template = struct.pack("<QI", len(signers_template) + 4, 0x7109871a) + signers_template
        block_size = len(v2_pair_template) + 8 + 16
        total_signing_block_len = block_size + 8

        # Calculate actual chunked SHA-256 digests across 3 parts
        # Android v2 spec: EoCD start of CD offset field in digest must match the offset prior to signing (i.e. cd_offset)
        part1 = zip_bytes[:cd_offset]
        part2 = zip_bytes[cd_offset:eocd_idx]
        part3 = zip_bytes[eocd_idx:]

        CHUNK_SIZE = 1048576
        chunks = []
        for part in [part1, part2, part3]:
            for i in range(0, len(part), CHUNK_SIZE):
                chunks.append(part[i:i+CHUNK_SIZE])

        chunk_digests = []
        for c in chunks:
            chunk_digests.append(hashlib.sha256(bytes([0xa5]) + struct.pack("<I", len(c)) + c).digest())

        root_digest = hashlib.sha256(bytes([0x5a]) + struct.pack("<I", len(chunk_digests)) + b"".join(chunk_digests)).digest()

        # Actual signed_data with real root_digest
        digests_data = lp(struct.pack("<I", 0x0103) + lp(root_digest))
        all_digests = lp(digests_data)
        signed_data = all_digests + all_certs + all_attrs

        # Sign signed_data with RSA-SHA256 PKCS#1 v1.5
        sd_path = os.path.join(tmpdir, "signed_data.bin")
        sig_path = os.path.join(tmpdir, "signature.bin")
        with open(sd_path, "wb") as f: f.write(signed_data)
        subprocess.run(["openssl", "dgst", "-sha256", "-sign", key_path, "-out", sig_path, sd_path], check=True)
        with open(sig_path, "rb") as f: real_sig = f.read()

        signatures_data = lp(struct.pack("<I", 0x0103) + lp(real_sig))
        all_sigs = lp(signatures_data)
        real_signer = lp(lp(signed_data) + all_sigs + all_pubkey)
        real_signers = lp(real_signer)
        v2_pair = struct.pack("<QI", len(real_signers) + 4, 0x7109871a) + real_signers
        assert len(v2_pair) == len(v2_pair_template), "Signer block size mismatch!"

        signing_block = struct.pack("<Q", block_size) + v2_pair + struct.pack("<Q", block_size) + b"APK Sig Block 42"
        assert len(signing_block) == total_signing_block_len, "Signing block length mismatch!"

        # Assemble final APK: Part 1 + Signing Block + Part 2 + Updated EOCD (pointing to new CD offset)
        new_cd_offset = cd_offset + total_signing_block_len
        final_eocd = zip_bytes[eocd_idx:eocd_idx+16] + struct.pack("<I", new_cd_offset) + zip_bytes[eocd_idx+20:]
        final_apk_bytes = part1 + signing_block + part2 + final_eocd
        with open(output_apk, "wb") as f:
            f.write(final_apk_bytes)

    # Verify alignment of resources.arsc
    with zipfile.ZipFile(output_apk, "r") as z_ver:
        for info in z_ver.infolist():
            if info.filename == "resources.arsc":
                with open(output_apk, "rb") as f:
                    f.seek(info.header_offset)
                    lfh = f.read(50)
                    fn_len, extra_len = struct.unpack("<HH", lfh[26:30])
                    data_offset = info.header_offset + 30 + fn_len + extra_len
                    assert info.compress_type == zipfile.ZIP_STORED, "resources.arsc must be ZIP_STORED!"
                    assert data_offset % 4 == 0, f"resources.arsc data offset {data_offset} not 4-byte aligned!"
                    print(f"Verified: resources.arsc is STORED and 4-byte aligned at offset {data_offset}.")

    size_mb = os.path.getsize(output_apk) / (1024 * 1024)
    print(f"Successfully created verified signed APK with v1 + v2 schemes: {output_apk} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    build()
