export class Rational {
  readonly numerator: number;   // Zähler
  readonly denominator: number; // Nenner

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('Der Nenner darf nicht Null sein.');
    }

    // Vorzeichen korrigieren: Nenner immer positiv halten
    const sign = Math.sign(numerator) * Math.sign(denominator);
    const absN = Math.abs(numerator);
    const absD = Math.abs(denominator);

    // Automatisch kürzen beim Erstellen
    const commonDivisor = this.gcd(absN, absD);

    this.numerator = (sign * absN) / commonDivisor;
    this.denominator = absD / commonDivisor;
  }

  // Hilfsmethode: Größter Gemeinsamer Teiler (Euklidischer Algorithmus)
  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  // Addition: (a/b) + (c/d) = (ad + bc) / bd
  add(other: Rational): Rational {
    return new Rational(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  // Multiplikation: (a/b) * (c/d) = (ac) / (bd)
  multiply(other: Rational): Rational {
    return new Rational(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  toString(): string {
    return this.denominator === 1 ? `${this.numerator}` : `${this.numerator}/${this.denominator}`;
  }

  toDouble(): number {
    return this.numerator / this.denominator;
  }
}

// Beispielnutzung:
const r1 = new Rational(1, 3);
const r2 = new Rational(1, 6);
const result = r1.add(r2);

console.log(result.toString()); // "1/2" (da 3/6 gekürzt wird)
