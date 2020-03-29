import { Injector } from "/js/fw/Injector.js";
import { Dom } from "/js/fw/Dom.js";
import { HomePage } from "/js/home/HomePage.js";

window.addEventListener("load", () => {

  /**/
  navigator.serviceWorker.register(
    "/cache.js",
    { scope: "/" }
  ).then(registration => {
  });
  /**/

  const injector = new Injector(window);
  const dom = injector.getInstance(Dom);
  const page = dom.newController(document.body, HomePage);
  page.setup();
});
