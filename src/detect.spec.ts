import { describe, it } from "node:test";
import { detect } from "./index";
import assert from "node:assert";

describe("detect", () => {
  it("should detect one phrase at the beginning of the text", () => {
    const text = "blazingly fast detector";

    const result = detect({ text });

    assert.strictEqual(result.detected.length, 1);
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "blazingly fast")?.index,
      0,
    );
    assert.strictEqual(result.percentage.toFixed(5), (0.6087).toFixed(5));
  });

  it("should detect two phrases in the middle of the text", () => {
    const text =
      "this one is the top notch detector with blazingly fast detection for node developers";

    const result = detect({ text });

    assert.strictEqual(result.detected.length, 2);
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "blazingly fast")?.index,
      40,
    );
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "top notch")?.index,
      16,
    );
    assert.strictEqual(result.percentage.toFixed(5), (0.27381).toFixed(5));
  });

  it("should not detect any phrases", () => {
    const text =
      "No more endless searching for the info you need. Everything you and your team store is accessible in an instant.";

    const result = detect({ text });

    assert.strictEqual(result.detected.length, 1);
    assert.strictEqual(result.detected[0].phrase, "endless");
    assert.strictEqual(result.detected[0].index, 8);
  });

  it("should throw an error when too many phrases are detected using count", () => {
    const text = "blazingly fast detector blazingly fast detector";

    assert.throws(() => detect({ text, throwAtCountOrAbove: 1 }));
  });

  it("should throw an error when too many phrases are detected using count with just one phrase", () => {
    const text = "blazingly fast detector";

    assert.throws(() => detect({ text, throwAtCountOrAbove: 1 }));
  });

  it("should throw an error when too many phrases are detected using percentage", () => {
    const text = "blazingly fast detector blazingly fast detector";
    assert.throws(() => detect({ text, throwOverPercentage: 0.5 }));
  });

  it("should skip phrases from ignorePhrases", () => {
    const text = "blazingly fast detector";
    const ignorePhrases = ["blazingly fast"];
    const result = detect({ text, ignorePhrases });
    assert.strictEqual(result.detected.length, 0);
    assert.strictEqual(result.percentage, 0);
  });

  it("should detect three phrases", () => {
    const result = detect({
      text: "blazingly fast top notch detector for fast paced environment workers",
    });

    assert.strictEqual(result.detected.length, 3);
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "blazingly fast")?.index,
      0,
    );
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "fast paced")?.index,
      38,
    );
    assert.strictEqual(
      result.detected.find((d) => d.phrase === "top notch")?.index,
      15,
    );
    assert.strictEqual(result.percentage.toFixed(5), (0.4852941).toFixed(5));
    assert.strictEqual(result.count, 3);
  });
});
