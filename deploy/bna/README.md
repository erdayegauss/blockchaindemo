# Bond Network

> The Bond Network allows the issuer of a bond to update the bond information whilst other members of the business network can only read the bond data.

This business network defines:

**Participants**
`Issuer` `Member`

**Assets**
`BondAsset`

**Transactions**
`PublishBond`

The `PublishBond` transaction submitted by an `Issuer` participant will create a new `BondAsset`.

To test this Business Network Definition in the **Test** tab:

Create a `Issuer` participant:

```
{
  "$class": "org.acme.bond.Issuer",
  "memberId": "memberId:1",
  "name": "Billy Thompson"
}
```

Create a `Member` participant:

```
{
  "$class": "org.acme.bond.Member",
  "memberId": "memberId:1",
  "name": "Jenny Jones"
}
```


The `PublishBond` transaction will create a new `BondAsset` in the Asset Registry.

Congratulations!

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
