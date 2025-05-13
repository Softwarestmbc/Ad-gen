import { safeHex } from "@/lib/fillTemplate"

describe("safeHex function", () => {
  test("returns #000000 for undefined input", () => {
    expect(safeHex(undefined)).toBe("#000000")
  })

  test("converts 3-digit hex to 6-digit hex", () => {
    expect(safeHex("ABC")).toBe("#aabbcc")
  })

  test("converts uppercase hex to lowercase", () => {
    expect(safeHex("#FFAA00")).toBe("#ffaa00")
  })

  // Additional test cases for comprehensive coverage
  test("returns #000000 for null input", () => {
    expect(safeHex(null as any)).toBe("#000000")
  })

  test("returns #000000 for empty string", () => {
    expect(safeHex("")).toBe("#000000")
  })

  test("handles hex with or without # prefix", () => {
    expect(safeHex("123456")).toBe("#123456")
    expect(safeHex("#123456")).toBe("#123456")
  })

  test("returns #000000 for invalid hex codes", () => {
    expect(safeHex("GHIJKL")).toBe("#000000")
    expect(safeHex("12345")).toBe("#000000")
    expect(safeHex("1234567")).toBe("#000000")
    expect(safeHex("not-a-hex")).toBe("#000000")
  })

  test("correctly expands other 3-digit hex codes", () => {
    expect(safeHex("123")).toBe("#112233")
    expect(safeHex("#f0c")).toBe("#ff00cc")
  })
})
