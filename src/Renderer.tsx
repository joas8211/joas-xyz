import { Component } from "@bikeshaving/crank";
import MarkdownIt from "markdown-it";
import yaml from "yaml";
import { renderer } from "@bikeshaving/crank/html";
import { createElement as h } from "@bikeshaving/crank";

export class Renderer {
  private Layout: Component;
  private md: MarkdownIt;

  constructor(Layout: Component) {
    this.Layout = Layout;
    this.md = new MarkdownIt();
  }

  async render(content: string): Promise<string> {
    const blocks = /^(?:---\n(.*?)\n---\n)?(.*)$/s.exec(content);
    if (!blocks) throw new Error("Error parsing page metadata");
    const meta = yaml.parse(blocks[1] || "");
    content = this.md.render(blocks[2]);
    return "<!doctype html>" + renderer.render(
      <this.Layout
        content={content}
        {...meta}
      />,
    );
  }
}
