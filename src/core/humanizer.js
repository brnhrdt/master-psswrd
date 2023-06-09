/**
 * Markov chain generator
 */

const empty_prefix = "-";
const numbers_cutoff = 1000n;

// Convert byte array to BigInt
// ugly hack
function bufToBn(buf) {
  var hex = ["00"];
  u8 = Uint8Array.from(buf);

  u8.forEach(function (i) {
    var h = i.toString(16);
    if (h.length % 2) {
      h = "0" + h;
    }
    hex.push(h);
  });

  return BigInt("0x" + hex.join(""));
}

export class MarkovHumanizer {
  constructor(m) {
    this.mapping = m;
  }

  /**
   * Generate string by Markov-chain.
   * @param {Uint8Array} bArray Entropy
   * @returns Password as pseudo-random string based on provided entropy
   */
  humanize(bArray) {
    // Setup
    // reset state
    var result = "";
    var current_state = empty_prefix;
    var next_state_set = [];

    // produce big int from byte array
    var numerator = bufToBn(bArray);

    // Iterate throgh states and divide entropy
    while (numerator > 0) {
      // are we to low for humanizing and need some numbers?
      if (numerator <= numbers_cutoff) {
        result = result + "-" + numerator;
        numerator = 0;
        break;
      }

      // get set of possible next states
      next_state_set = this.mapping[current_state];

      // detrmine length of it
      let next_len = BigInt(next_state_set.length);

      // divide by length and pick next state based on modulo of division
      let fraction = numerator / next_len;
      let remainder = numerator % next_len;

      // update state
      current_state = next_state_set[remainder];
      numerator = fraction;
      result = result + current_state;
    }
    return result;
  }
}
