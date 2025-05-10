
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { decimalToFullHexString } from '@/lib/hexUtils';
import { ArrowRight, Divide, Hash } from 'lucide-react';

interface ExplanationPanelProps {
  targetDecimal: number;
}

export default function ExplanationPanel({ targetDecimal }: ExplanationPanelProps) {
  const quotient = Math.floor(targetDecimal / 16);
  const remainder = targetDecimal % 16;

  const hexHighNibbleChar = quotient.toString(16).toUpperCase();
  const hexLowNibbleChar = remainder.toString(16).toUpperCase();
  const fullHex = decimalToFullHexString(targetDecimal);

  return (
    <Card className="mt-4 border-dashed border-accent bg-accent/10 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-accent-foreground flex items-center gap-2">
          <Hash className="w-5 h-5" />
          How to Convert {targetDecimal} (Decimal) to Hexadecimal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-accent-foreground/80">
        <div>
          <p className="font-semibold text-accent-foreground flex items-center gap-1 mb-1">
            <Divide className="w-4 h-4" /> Step 1: Divide by 16 to find Quotient & Remainder
          </p>
          <div className="pl-6 bg-background/30 p-3 rounded-md space-y-1">
            <p>
              To convert {targetDecimal} to hexadecimal, we first determine how many whole times 16 fits into it, and what is left over.
            </p>
            <p>When {targetDecimal} is divided by 16:</p>
            <ul className="list-disc list-inside ml-2">
                <li>The <strong>quotient</strong> (how many full times 16 goes into {targetDecimal}) is <span className="font-bold text-primary">{quotient}</span>.</li>
                <li>The <strong>remainder</strong> (what's left over after taking out all multiples of 16) is <span className="font-bold text-primary">{remainder}</span>.</li>
            </ul>
            <p className="mt-2">
              This means: {targetDecimal} = ({quotient} × 16) + {remainder}.
            </p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-accent-foreground mb-1">Step 2: Convert the Quotient and Remainder to Hex Digits</p>
          <div className="pl-6 space-y-2">
            <div className="bg-background/30 p-3 rounded-md">
                <p>
                    The <strong className="text-primary">Quotient</strong> (which is <span className="font-bold">{quotient}</span>) becomes the <strong className="text-primary">High Nibble</strong> (the left hex digit).
                </p>
                <p>
                    In hexadecimal, the decimal value {quotient} is represented as <span className="font-mono text-lg text-primary font-bold">{hexHighNibbleChar}</span>.
                </p>
            </div>
            <div className="bg-background/30 p-3 rounded-md">
                <p>
                    The <strong className="text-primary">Remainder</strong> (which is <span className="font-bold">{remainder}</span>) becomes the <strong className="text-primary">Low Nibble</strong> (the right hex digit).
                </p>
                <p>
                    In hexadecimal, the decimal value {remainder} is represented as <span className="font-mono text-lg text-primary font-bold">{hexLowNibbleChar}</span>.
                </p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-accent-foreground mb-1">Step 3: Combine the Hex Digits</p>
          <div className="pl-6 bg-background/30 p-3 rounded-md">
            <p className="flex items-center flex-wrap">
              High Nibble: <span className="font-mono text-primary text-xl font-bold mx-1">{hexHighNibbleChar}</span>
              <span className="mx-1">,</span>
              Low Nibble: <span className="font-mono text-primary text-xl font-bold mx-1">{hexLowNibbleChar}</span>
              <ArrowRight className="w-5 h-5 mx-2 text-primary" />
              Resulting Hex Value: <span className="font-mono text-2xl text-primary font-bold ml-1">0x{fullHex}</span>
            </p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-accent-foreground mb-1">Verification (Using the Hex Value)</p>
          <div className="pl-6 bg-background/30 p-3 rounded-md">
            <p>
              To verify, convert the hex digits back to decimal and sum them up:
            </p>
            <p className="mt-1">
                (Hex Digit <span className="font-mono text-primary font-bold">{hexHighNibbleChar}</span> × 16) + (Hex Digit <span className="font-mono text-primary font-bold">{hexLowNibbleChar}</span> × 1)
            </p>
            <p className="mt-1">
                = (<span className="font-bold text-primary">{quotient}</span> × 16) + (<span className="font-bold text-primary">{remainder}</span> × 1)
            </p>
            <p className="mt-1">
                = {quotient * 16} + {remainder} = <span className="font-bold text-2xl text-primary">{targetDecimal}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

