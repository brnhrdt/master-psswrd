/**
 * Password generator - wrapper class for cryptographic
 * operations and string generation
 */

export class PasswordGenerator {
  constructor(sg, h) {
    this.seedGenerator = sg;
    this.hmanizer = h;
  }

  generatePassword(master, ressource) {
    let seed = this.seedGenerator.generateSeed(master, ressource);
    let pass = this.hmanizer.humanize(seed);

    return pass;
  }
}
