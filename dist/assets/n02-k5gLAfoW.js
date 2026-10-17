const e=`<p class="goal">Every value in every program is a pattern of bits. Here's how numbers become bits, and where that breaks.</p>
<h3>Bits, bytes, and positional notation</h3>
<p>A <b>bit</b> is 0 or 1. A <b>byte</b> is 8 bits, so it has 256 possible patterns. Positional notation works in any base: in decimal, <code>427 = 4×10² + 2×10¹ + 7×10⁰</code>. In binary the weights are powers of 2:</p>
<div class="diagram">weight:   128  64  32  16   8   4   2   1
 0x2A  =    0   0   1   0   1   0   1   0   = 32 + 8 + 2 = 42
 hex digit = exactly 4 bits:  0010 1010 → 2 A</div>
<table>
<tr><th>Unit</th><th>Size</th><th>Holds</th></tr>
<tr><td>nibble</td><td>4 bits</td><td>one hex digit</td></tr>
<tr><td>byte</td><td>8 bits</td><td>0–255, or one ASCII character</td></tr>
<tr><td>word</td><td>64 bits on modern CPUs</td><td>a pointer, or a register's worth of data</td></tr>
<tr><td>KB / KiB</td><td>1000 / 1024 bytes</td><td>disk makers use powers of 10; RAM and the OS use powers of 2. That's why a "1 TB" disk shows as 931 GiB</td></tr>
</table>
<pre data-lang="python"><code class="language-python">bin(42), hex(42), oct(42)      # '0b101010' '0x2a' '0o52'
int("101010", 2), int("2a", 16)  # 42 42
(42).bit_length()              # 6
f"{42:08b}"                    # '00101010'</code></pre>

<h3>Boolean algebra</h3>
<p>Everything a CPU does is built from AND, OR and NOT gates. Two laws you'll use constantly when simplifying conditions are <b>De Morgan's laws</b>:</p>
<pre data-lang="plaintext"><code class="language-plaintext">not (A and B)  ==  (not A) or (not B)
not (A or B)   ==  (not A) and (not B)

if not (is_paid and has_stock):   ==   if not is_paid or not has_stock:</code></pre>
<p>XOR (<code>^</code>) is true when its inputs differ. It's used in checksums, RAID parity, and swapping without a temporary (a party trick, don't do it in real code).</p>

<h3>Signed integers: two's complement</h3>
<p>To store negative numbers, the top bit gets a <i>negative</i> weight. For 8 bits that weight is −128, so <code>1111 1111</code> = −128 + 127 = −1. To negate a number: flip every bit, then add 1. The reason this design won is that the same adder circuit works for signed and unsigned numbers. Ranges for n bits: unsigned 0 … 2ⁿ−1; signed −2ⁿ⁻¹ … 2ⁿ⁻¹−1.</p>
<table>
<tr><th>Type</th><th>Range</th><th>Where you meet it</th></tr>
<tr><td><code>u8</code> / <code>uint8</code></td><td>0 … 255</td><td>bytes, pixels, RGB</td></tr>
<tr><td><code>i32</code> / <code>int32</code></td><td>±2.1 billion</td><td>C <code>int</code>; overflows on real data (view counts, money in paise)</td></tr>
<tr><td><code>i64</code></td><td>±9.2 × 10¹⁸</td><td>IDs, timestamps, counts. The safe default.</td></tr>
<tr><td>JS <code>number</code></td><td>integers exact only to 2⁵³</td><td>64-bit IDs from APIs silently lose precision in JS. Send them as strings.</td></tr>
</table>

<h3>Overflow behaviour differs by language</h3>
<table>
<tr><th>Language</th><th><code>i32::MAX + 1</code></th></tr>
<tr><td>C (signed)</td><td><b>undefined behaviour</b>: the optimiser may assume it never happens</td></tr>
<tr><td>C (unsigned), Go</td><td>wraps around silently</td></tr>
<tr><td>Rust</td><td>panics in debug builds, wraps in release; use <code>checked_add</code>/<code>wrapping_add</code>/<code>saturating_add</code> to be explicit</td></tr>
<tr><td>Python</td><td>never overflows: ints are arbitrary precision</td></tr>
<tr><td>JS</td><td>becomes an imprecise float after 2⁵³</td></tr>
</table>
<p>Real incident: in 2014 YouTube's view counter was a 32-bit signed int, and "Gangnam Style" passed 2,147,483,647 views. They moved to 64-bit.</p>

<h3>Floating point in one picture</h3>
<div class="diagram">f64 = [ sign 1 bit ][ exponent 11 bits ][ fraction 52 bits ]
value = (−1)^sign × 1.fraction × 2^(exponent − 1023)
≈ 15–17 significant decimal digits; the spacing between representable numbers grows with magnitude</div>
<p>Consequences, which <a class="xref" data-old="c02">chapter 7</a> shows in code: <code>0.1 + 0.2 != 0.3</code>; adding a tiny number to a huge one can do nothing at all; <code>NaN != NaN</code>. Floats are fine for physics and graphics, but never for money. f32 has only about 7 digits, which is why GPUs and ML get away with even less (FP16, BF16, FP8: see the VRAM chapter).</p>

<h3>Endianness</h3>
<p>A multi-byte number can be stored most-significant byte first (<b>big-endian</b>: network protocols, "network byte order") or least-significant first (<b>little-endian</b>: x86 and ARM in practice). <code>0x12345678</code> in memory on your Ryzen is <code>78 56 34 12</code>. It matters whenever you read binary files or network packets byte by byte:</p>
<pre data-lang="python"><code class="language-python">import struct
struct.pack("&lt;I", 0x12345678)   # b'xV4\\x12'   little-endian
struct.pack("&gt;I", 0x12345678)   # b'\\x124Vx'   big-endian (network order)
int.from_bytes(b"\\x00\\x01", "big")   # 1</code></pre>
<pre data-lang="go"><code class="language-go">binary.BigEndian.Uint32(buf[0:4])     // Go: read a network-order uint32</code></pre>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>2.1 <span class="levels">basic</span> By hand: what is −5 as an 8-bit two's-complement number? Check with <code>(-5) &amp; 0xFF</code> in Python.</summary><div><p>5 = 0000 0101; flip the bits to get 1111 1010; add 1 to get <b>1111 1011</b> = 0xFB = 251 when read as unsigned.</p></div></details>
<details class="ex"><summary>2.2 <span class="levels">basic</span> Write <code>to_binary(n)</code> without <code>bin()</code>, using repeated <code>% 2</code> and <code>// 2</code>.</summary><div><pre data-lang="python"><code class="language-python">def to_binary(n):
    if n == 0: return "0"
    bits = []
    while n: bits.append(str(n % 2)); n //= 2
    return "".join(reversed(bits))</code></pre></div></details>
<details class="ex"><summary>2.3 <span class="levels">think</span> Why does <code>sum([0.1] * 10) == 1.0</code> give False, but <code>math.fsum([0.1] * 10) == 1.0</code> give True?</summary><div><p>Each <code>+</code> rounds to the nearest representable float, and the rounding errors accumulate. <code>fsum</code> tracks the lost low-order bits exactly (Shewchuk's algorithm) and rounds only once at the end.</p></div></details>
</div>
`;export{e as default};
