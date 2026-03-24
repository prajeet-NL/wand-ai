import { describe, expect, it } from "vitest";
import { parseMRZ } from "@/lib/passportMrz";

describe("parseMRZ", () => {
  it("extracts passport details from MRZ text", () => {
    const result = parseMRZ(
      "P<INDJAIN<<PRAJEET<<<<<<<<<<<<<<<<<<\nZ1234567<IND9605123M2501012<<<<<<<<<<<<<<04",
    );

    expect(result).toEqual({
      fullName: "Prajeet Jain",
      passportNumber: "Z1234567",
      nationality: "IND",
      dateOfBirth: "1996-05-12",
    });
  });
});
