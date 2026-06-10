export const CURL_NEWS = [
  `<span class="tok-punct">$</span> <span class="tok-cmd">curl</span> -H <span class="tok-str">"X-API-Key: &lt;your key&gt;"</span> \\`,
  `  <span class="tok-url">"https://api.lumina-core.cn/v1/news?q=新能源&amp;limit=10"</span>`,
].join("\n");

export const CURL_YC = [
  `<span class="tok-punct">$</span> <span class="tok-cmd">curl</span> -H <span class="tok-str">"X-API-Key: &lt;your key&gt;"</span> \\`,
  `  <span class="tok-url">"https://api.lumina-core.cn/v1/yc/companies?batch_year=2024&amp;status=Active"</span>`,
].join("\n");

export const CURL_QUICKSTART = CURL_NEWS;
