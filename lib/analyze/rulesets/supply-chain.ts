import type { RuleDefinition } from "../prompt";

export const SUPPLY_CHAIN_RULES: readonly RuleDefinition[] = [
  {
    id: "supply/known-cve",
    ruleset: "supply-chain",
    severity: "high",
    what: "package.json pins a version of a package with a known CVE (next < 16.3.3, @supabase/supabase-js < 2.45, etc.).",
    why: "You'll fail vendor security review and buyer procurement will flag it in the next renewal cycle.",
    fix: "Bump to the fixed version. If breaking, document the risk acceptance in a comment and pin a mid-range version until you can upgrade.",
  },
  {
    id: "supply/postinstall-script",
    ruleset: "supply-chain",
    severity: "medium",
    what: "New dependency added that includes a `postinstall` script and isn't a well-known package (esbuild, sharp, prisma).",
    why: "Supply-chain attack vector. `postinstall` runs on every `npm install`, including CI.",
    fix: "Add the package to `allowScripts` in package.json only after verifying the postinstall behavior.",
  },
  {
    id: "supply/deprecated-package",
    ruleset: "supply-chain",
    severity: "low",
    what: "Adding a package that is deprecated per its npm metadata (e.g., `request`, `moment`, `node-fetch@2`).",
    why: "Deprecated packages don't receive security patches. Migration cost grows over time.",
    fix: "Use the modern replacement noted in the deprecation message (native `fetch`, `date-fns`, `undici`).",
  },
  {
    id: "supply/version-wildcard",
    ruleset: "supply-chain",
    severity: "medium",
    what: "package.json contains a `*` or `latest` version pin.",
    why: "Non-reproducible builds. Two `npm install`s a week apart may install different versions with different vulnerabilities.",
    fix: "Pin an exact version or use `^X.Y.Z` for controlled updates.",
  },
  {
    id: "supply/git-dependency",
    ruleset: "supply-chain",
    severity: "medium",
    what: "package.json contains a `git+` or `github:` dependency (not a published npm version).",
    why: "The referenced repo can change history or be deleted. Non-reproducible + potential availability failure.",
    fix: "Fork to your own registry OR publish the required version to a scoped npm namespace you control.",
  },
];
