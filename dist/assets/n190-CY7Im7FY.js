const e=`<p class="goal">Reducing the cost of distance and bytes on the network.</p>
<ul>
<li><b>Round trips dominate:</b> each one costs 1–150 ms depending on distance. Reduce them with keep-alive and connection pooling, HTTP/2 multiplexing, batch APIs, and GraphQL or composite endpoints where they fit.</li>
<li><b>Move the data closer:</b> CDN and edge caching; regions near users (an India-hosted API for Indian stores).</li>
<li><b>Send fewer bytes:</b> compression (Brotli/gzip for text; already-compressed images and video don't benefit), pagination, field selection, efficient formats (Protobuf, MessagePack) for high-volume internal traffic, and modern image formats.</li>
<li><b>Handshakes:</b> TLS 1.3 and session resumption; HTTP/3 (QUIC) helps on lossy mobile networks.</li>
<li><b>Mobile reality:</b> high latency, packet loss, and network switches. Design for retries, offline mode, and small payloads.</li>
<li>Measure with <code>curl -w</code> timing (<a class="xref" data-old="n58">chapter 58</a>), the browser Network waterfall, and real-user monitoring.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>190.1 <span class="levels">basic</span> Measure the transfer size of this site's main JS with and without compression using <code>curl --compressed -w '%{size_download}'</code>.</summary><div><p>Brotli/gzip typically shrink JS by 3–4×. Serve precompressed assets and long cache headers.</p></div></details>
</div>
`;export{e as default};
