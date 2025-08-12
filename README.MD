# FormatUtils

- Usage

```
FormatUtils.toUnits(1, 18) //1_000_000_000_000_000_000gwei
FormatUtils.fromUnits(120000000000000000n, 18) // 0.12eth

FormatUtils.shitNumber(0.0000000000000123456) //0.0{13}1234
FormatUtils.shitNumber('0.0000456', 2, 4) //0.000045
FormatUtils.shitNumber('0.000000456', 2, 4) //0.0{6}45
FormatUtils.shitNumber('0.000000456', 2, 6) //0.00000045

FormatUtils.toTradingViewNumber(0.0000000000000123456) //0.0₁₃1234
FormatUtils.toTradingViewNumber('0.0000456') //0.0000456
FormatUtils.toTradingViewNumber('0.000000456') //0.0₆456
FormatUtils.toTradingViewNumber('0.000000456', 2, 6) //0.00000045
FormatUtils.toTradingViewNumber('0.0000000456', 2, 6) //0.0₇45

FormatUtils.deformatNumberToPureString('1.23e+10') //12300000000
FormatUtils.deformatNumberToPureString('1.23e-10') //0.000000000123
FormatUtils.deformatNumberToPureString('0.0{13}1234') //0.00000000000001234
FormatUtils.deformatNumberToPureString('0.0{5}1234') //0.000001234
FormatUtils.revertSubSymbol('0.0₁₃1234')) //0.0{13}1234
FormatUtils.deformatNumberToPureString('0.0₁₃1234') //0.00000000000001234
```