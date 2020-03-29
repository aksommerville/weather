export class NwsTransport {

  static getDependencies() {
    return [Window];
  }
  constructor(window) {
    this.window = window;
  }

  get(path) {
    if (!path.startsWith("/")) throw new Error(`Invalid path: ${path}`);
    const url = `https://api.weather.gov${path}`;
    const options = {
      method: "GET",
      /* unsure whether this is correct or not, but anyway i don't think we're allowed to override user-agent
      headers: {
        "User-Agent": "akweather, aksommerville@gmail.com",
      },
      /**/
    };
    return this.window.fetch(url, options);
  }

}

NwsTransport.singleton = true;
