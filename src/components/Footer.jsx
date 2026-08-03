import React from "react";

const columns = [
  {
    title: "Product",
    links: ["Feed", "Connections", "Requests"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Careers"],
  },
];

const socials = [
  {
    label: "X",
    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
  },
  {
    label: "YouTube",
    path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
  },
  {
    label: "GitHub",
    path: "M12 .5C5.648.5.5 5.648.5 12c0 5.084 3.292 9.394 7.865 10.916.575.106.785-.25.785-.554 0-.274-.01-1.001-.016-1.964-3.2.695-3.876-1.542-3.876-1.542-.523-1.33-1.278-1.684-1.278-1.684-1.045-.715.08-.7.08-.7 1.156.081 1.764 1.187 1.764 1.187 1.027 1.76 2.695 1.252 3.352.958.104-.744.402-1.252.732-1.54-2.555-.29-5.243-1.278-5.243-5.686 0-1.256.448-2.283 1.184-3.09-.119-.29-.513-1.462.112-3.048 0 0 .967-.31 3.167 1.18a10.98 10.98 0 0 1 2.884-.388c.978.005 1.964.132 2.884.388 2.198-1.49 3.164-1.18 3.164-1.18.627 1.586.233 2.758.114 3.048.737.807 1.183 1.834 1.183 3.09 0 4.42-2.693 5.392-5.258 5.676.414.357.782 1.06.782 2.136 0 1.542-.014 2.785-.014 3.164 0 .307.207.665.79.552C20.71 21.39 24 17.082 24 12c0-6.352-5.148-11.5-12-11.5z",
  },
];

function Footer() {
  return (
    <footer className="bg-[#0B0D12] border-t border-[#2A2E3A] px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-2">
          <div className="font-mono text-lg font-medium text-[#E7E9EE]">
            <span className="text-[#7C6CFF]">{"<"}</span>devTinder<span className="text-[#7C6CFF]">{"/>"}</span>
          </div>
          <p className="text-sm text-[#8A8FA3] mt-3 max-w-xs">
            Where developers match on stack, not just swipes.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h6 className="text-xs font-semibold uppercase tracking-wide text-[#565B6B] mb-3">
              {col.title}
            </h6>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#8A8FA3] hover:text-[#E7E9EE] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#2A2E3A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#565B6B]">© {new Date().getFullYear()} devTinder. All rights reserved.</p>
        <div className="flex gap-4">
          {socials.map((s) => (
            <a key={s.label} href="#" aria-label={s.label} className="text-[#565B6B] hover:text-[#7C6CFF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                <path d={s.path}></path>
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;