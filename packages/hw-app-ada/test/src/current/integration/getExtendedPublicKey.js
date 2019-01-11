import { expect } from "chai";
import pathDerivations from "../../pathDerivations";

import { getAda, pathToArray } from "../../utils";

describe("getExtendedPublicKey", async () => {
  let ada = {};

  beforeEach(async () => {
    ada = await getAda();
  });

  afterEach(async () => {
    await ada.t.close();
  });

  it("Should successfully get extended public key", async () => {
    const der1 = pathDerivations["44'/1815'/1'"];
    const der2 = pathDerivations["44'/1815'/1'/0/12'"];
    const der3 = pathDerivations["44'/1815'/1'/0/10'/1/2/3"];

    const result1 = await ada.getExtendedPublicKey(pathToArray(der1.path));
    const result2 = await ada.getExtendedPublicKey(pathToArray(der2.path));
    const result3 = await ada.getExtendedPublicKey(pathToArray(der3.path));

    expect(result1.publicKey).to.equal(der1.publicKey);
    expect(result1.chainCode).to.equal(der1.chainCode);

    expect(result2.publicKey).to.equal(der2.publicKey);
    expect(result2.chainCode).to.equal(der2.chainCode);

    expect(result3.publicKey).to.equal(der3.publicKey);
    expect(result3.chainCode).to.equal(der3.chainCode);
  });

  it("Should return the same public key with the same path consistently", async () => {
    const path = pathToArray("44'/1815'/1'");

    const res1 = await ada.getExtendedPublicKey(path);
    const res2 = await ada.getExtendedPublicKey(path);

    expect(res1.publicKey).to.equal(res2.publicKey);
    expect(res1.chainCode).to.equal(res2.chainCode);
  });

  it("Should reject path with non-number element", async () => {
    try {
      await ada.getExtendedPublicKey([
        ...pathToArray("44'/1815'/55'"),
        "non-number"
      ]);

      throw new Error("Expected error");
    } catch (error) {
      expect(error.message).to.have.string("5003");
    }
  });

  it("Should reject path not starting with 44'/1815'/n'", async () => {
    try {
      await ada.getExtendedPublicKey(pathToArray("44'/1815'/33/125"));

      throw new Error("Expected error");
    } catch (error) {
      expect(error.message).to.have.string("5001");
    }
  });

  it("Should reject path shorter than 3 indexes", async () => {
    try {
      await ada.getExtendedPublicKey(pathToArray("44'/1815'"));

      throw new Error("Expected error");
    } catch (error) {
      expect(error.message).to.have.string("5002");
    }
  });
});
