// src/lib/geometry/triangleUtils.ts

export interface Point {
  x: number;
  y: number;
}

export interface TriangleVertices {
  A: Point;
  B: Point;
  C: Point;
}

export interface TriangleSides {
  a: number; // Side opposite A (BC)
  b: number; // Side opposite B (AC)
  c: number; // Side opposite C (AB)
}

export interface TriangleAngles {
  A: number; // Angle at vertex A in degrees
  B: number; // Angle at vertex B in degrees
  C: number; // Angle at vertex C in degrees
}

/**
 * Calculates the distance between two points.
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculates the lengths of the three sides of a triangle given its vertices.
 */
export function calculateSideLengths(vertices: TriangleVertices): TriangleSides {
  const a = distance(vertices.B, vertices.C);
  const b = distance(vertices.A, vertices.C);
  const c = distance(vertices.A, vertices.B);
  return { a, b, c };
}

/**
 * Calculates the angles of a triangle (in degrees) using the Law of Cosines, given side lengths.
 */
export function calculateAngles(sides: TriangleSides): TriangleAngles {
  const { a, b, c } = sides;

  if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) {
    // Not a valid triangle
    return { A: NaN, B: NaN, C: NaN };
  }

  const angleA_rad = Math.acos((b * b + c * c - a * a) / (2 * b * c));
  const angleB_rad = Math.acos((a * a + c * c - b * b) / (2 * a * c));
  const angleC_rad = Math.PI - angleA_rad - angleB_rad; // More stable than third acos

  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  return {
    A: toDegrees(angleA_rad),
    B: toDegrees(angleB_rad),
    C: toDegrees(angleC_rad),
  };
}

/**
 * Calculates the area of a triangle using Heron's formula, given side lengths.
 */
export function calculateArea(sides: TriangleSides): number {
  const { a, b, c } = sides;
  const s = (a + b + c) / 2; // Semi-perimeter
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  return isNaN(area) || area < 0 ? 0 : area; // Handle invalid triangles
}

/**
 * Calculates the perimeter of a triangle.
 */
export function calculatePerimeter(sides: TriangleSides): number {
  return sides.a + sides.b + sides.c;
}

/**
 * Classifies a triangle based on its side lengths and angles.
 * Note: This is a simplified classification.
 */
export function classifyTriangle(sides: TriangleSides, angles: TriangleAngles): string {
  const { a, b, c } = sides;
  const { A, B, C } = angles;

  if (isNaN(A) || isNaN(B) || isNaN(C)) return "Invalid";

  const uniqueSides = new Set([a.toFixed(2), b.toFixed(2), c.toFixed(2)]).size;
  
  const isRight = [A,B,C].some(angle => Math.abs(angle - 90) < 0.1);

  if (uniqueSides === 1) return isRight ? "Equilateral & Right (Impossible)" : "Equilateral"; // Equilateral cannot be right
  if (uniqueSides === 2) return isRight ? "Isosceles Right" : "Isosceles";
  
  return isRight ? "Scalene Right" : "Scalene";
}