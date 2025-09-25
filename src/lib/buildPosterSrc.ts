export default function buildPosterSrc(posterUrl?: string | null) {
  if (!posterUrl) return "/file.svg";

  // If posterUrl is an absolute URL, try to fix missing TMDB size segment
  if (/^https?:\/\//i.test(posterUrl)) {
    try {
      const url = new URL(posterUrl);
      if (url.hostname === "image.tmdb.org") {
        const parts = url.pathname.split("/").filter(Boolean);
        // Example bad path: /t/p/inception.jpg -> parts = ['t','p','inception.jpg']
        if (parts[0] === "t" && parts[1] === "p" && parts.length === 3) {
          return `https://image.tmdb.org/t/p/w300/${parts[2]}`;
        }
      }
    } catch {
      // fall through to other heuristics
    }
    return posterUrl;
  }

  // posterUrl is a relative path like '/inception.jpg' or '/w300/abc.jpg' or '/t/p/inception.jpg'
  const cleaned = posterUrl.replace(/^\/+/, "");
  const segs = cleaned.split("/");

  // single segment -> likely filename only
  if (segs.length === 1) return `https://image.tmdb.org/t/p/w300/${segs[0]}`;

  // paths starting with 't/p/...'
  if (segs[0] === "t" && segs[1] === "p") {
    // 't/p/filename' (missing size) -> add default size
    if (segs.length === 3) return `https://image.tmdb.org/t/p/w300/${segs[2]}`;

    // 't/p/size/filename...' (already includes size) -> join the tail starting at size
    // e.g. ['t','p','w300','abc.jpg'] -> 'w300/abc.jpg'
    return `https://image.tmdb.org/t/p/${segs.slice(2).join("/")}`;
  }

  // already includes size as first segment (e.g. 'w300/abc.jpg' or 'original/abc.jpg')
  if (/^w\d+$/.test(segs[0]) || segs[0] === "original") {
    return `https://image.tmdb.org/t/p/${cleaned}`;
  }

  // default: prefix with tmdb and use default size
  return `https://image.tmdb.org/t/p/w300/${cleaned}`;
}
