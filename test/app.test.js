const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const captionApi = require("../api/caption");

function page(name) {
  return fs.readFileSync(path.join(__dirname, "..", "public", name), "utf8");
}

function call(handler, { method = "POST" } = {}) {
  const out = { status: null, body: null };
  const res = {
    setHeader() {},
    status(code) { out.status = code; return this; },
    json(body) { out.body = body; return this; },
  };
  handler({ method, headers: {} }, res);
  return out;
}

test("the caption API always answers 500 with the error text", () => {
  for (const method of ["POST", "GET"]) {
    const r = call(captionApi, { method });
    assert.strictEqual(r.status, 500);
    assert.deepStrictEqual(r.body, { error: "The captioning model is not available right now" });
    assert.strictEqual(r.body.caption, undefined);
  }
});

test("the landing page links to the try page and the about page", () => {
  const html = page("index.html");
  assert.match(html, /<h1>CaptionIt<\/h1>/);
  assert.match(html, /<a href="\/try\.html">Try it<\/a>/);
  assert.match(html, /href="\/about\.html"/);
});

test("the try page has a photo picker and a Write my caption button", () => {
  const html = page("try.html");
  assert.match(html, /<input id="photo" type="file" accept="image\/\*">/);
  assert.match(html, />Write my caption<\/button>/);
  assert.match(html, /\/api\/caption/);
  assert.match(html, /role="alert"/);
});

test("the try page shows the error text in the alert region", () => {
  const html = page("try.html");
  assert.match(html, /alertBox\.textContent = data\.error/);
});

test("the about page has its heading and text", () => {
  const html = page("about.html");
  assert.match(html, /<h1>About CaptionIt<\/h1>/);
  assert.match(html, /CaptionIt is a small demo/);
});

test("the stylesheet exists", () => {
  assert.ok(page("style.css").length > 0);
});

test("the try page shows which photo was chosen", () => {
  const html = page("try.html");
  assert.match(html, /<p id="chosen">No photo chosen yet<\/p>/);
  assert.match(html, /Photo chosen: /);
});
