import { describe, it, expect } from "vitest";
import { addFifteenMinutes } from "./calendar-utilities";

describe("addFifteenMinutes", () => {
  it("adds 15 minutes to a given date", () => {
    const date = new Date("2024-01-15T10:00:00");
    const result = addFifteenMinutes(date);

    expect(result).toEqual(new Date("2024-01-15T10:15:00"));
  });

  it("handles hour rollover correctly", () => {
    const date = new Date("2024-01-15T10:50:00");
    const result = addFifteenMinutes(date);

    expect(result).toEqual(new Date("2024-01-15T11:05:00"));
  });

  it("handles day rollover correctly", () => {
    const date = new Date("2024-01-15T23:50:00");
    const result = addFifteenMinutes(date);

    expect(result).toEqual(new Date("2024-01-16T00:05:00"));
  });

  it("does not mutate the original date", () => {
    const date = new Date("2024-01-15T10:00:00");
    const originalTime = date.getTime();

    addFifteenMinutes(date);

    expect(date.getTime()).toBe(originalTime);
  });
});
