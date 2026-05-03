export class Rational {
  readonly numerator: number; // Numerator
  readonly denominator: number; // Denominator

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('Der Nenner darf nicht Null sein.');
    }

    // Correct the sign: always keep the denominator positive
    const sign = Math.sign(numerator) * Math.sign(denominator);
    const absN = Math.abs(numerator);
    const absD = Math.abs(denominator);

    // Automatically reduce when creating
    const commonDivisor = this.gcd(absN, absD);

    this.numerator = (sign * absN) / commonDivisor;
    this.denominator = absD / commonDivisor;
  }

  // Helper method: greatest common divisor (Euclidean algorithm)
  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  // Addition: (a/b) + (c/d) = (ad + bc) / bd
  add(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  // Multiplication: (a/b) * (c/d) = (ac) / (bd)
  multiply(other: Rational): Rational {
    return new Rational(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  toString(): string {
    return this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
  }

  toDouble(): number {
    return this.numerator / this.denominator;
  }
}

// Example usage:
const r1 = new Rational(1, 3);
const r2 = new Rational(1, 6);
const result = r1.add(r2);

console.log(result.toString()); // "1/2" (because 3/6 is reduced)
