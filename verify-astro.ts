import { computeChart, sunLongitude, moonLongitude, planetLongitude, ascendantLongitude } from "@/lib/engines/astrology";

// JD for 2000-01-01 12:00 UTC = 2451545.0
const jd = 2451545.0;
console.log("=== 2000-01-01 12:00 UTC (J2000) ===");
console.log("Sun lon:", sunLongitude(jd).toFixed(3), "(expect ~280.37, Capricorn)");
console.log("Moon lon:", moonLongitude(jd).toFixed(2), "(expect ~217-223, Scorpio)");
console.log("Mercury:", planetLongitude("mercury", jd).toFixed(2));
console.log("Venus:", planetLongitude("venus", jd).toFixed(2), "(expect ~240-241, Sag)");
console.log("Mars:", planetLongitude("mars", jd).toFixed(2), "(expect ~327-328, Aquarius)");
console.log("Jupiter:", planetLongitude("jupiter", jd).toFixed(2), "(expect ~25, Aries)");
console.log("Saturn:", planetLongitude("saturn", jd).toFixed(2), "(expect ~40, Taurus)");

// Equinox check: 2024-03-20 03:06 UTC sun should be ~0.0
// JD calc via chart with London (tz 0)
console.log("\n=== computeChart: 2024-03-20 03:06 London (equinox) ===");
const eq = computeChart({ y: 2024, m: 3, d: 20, hour: 3, minute: 6, cityIndex: 31 });
console.log("Sun lon:", eq.sun.lon, "sign:", eq.sun.sign.slug, "(expect ~0.0 aries)");

console.log("\n=== computeChart: 1990-08-15 14:30 Taipei ===");
const c = computeChart({ y: 1990, m: 8, d: 15, hour: 14, minute: 30, cityIndex: 0 });
for (const p of c.planets) console.log(p.name, p.symbol, p.lon, p.sign.name, p.degreeInSign + "°");
console.log("ASC:", c.ascendant?.lon, c.ascendant?.sign.name);
// Sun 1990-08-15 ~ Leo 22 (lon ~142.2)

console.log("\n=== unknownTime ===");
const u = computeChart({ y: 1990, m: 8, d: 15, hour: 0, minute: 0, cityIndex: 0, unknownTime: true });
console.log("asc null?", u.ascendant === null, "sun:", u.sun.sign.name);

// Ascendant sanity: RAMC=0 at equator should give Asc=90 (Cancer 0)
// Find jd where gmst+lon=0 is hard; instead direct test of formula characteristics is embedded above.
console.log("\nASC formula check (lat 0):");
// pick a jd, compute
const a1 = ascendantLongitude(2451545.0, 0, 0);
console.log("asc(J2000, 0N, 0E):", a1.toFixed(2), "(GMST J2000 ~280.46 => RAMC 280.46 => asc ~ expect value in Capricorn/Aquarius region ~10-20 Aquarius?)");

// Solar eclipse checks: moon lon should equal sun lon (within ~0.5 deg)
function jdOf(y:number,m:number,d:number,ut:number){let Y=y,M=m;if(M<=2){Y-=1;M+=12;}const A=Math.floor(Y/100);const B=2-A+Math.floor(A/4);return Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(M+1))+d+B-1524.5+ut/24;}
const e1 = jdOf(1999,8,11,11.05); // total eclipse 1999-08-11 11:03 UT
console.log("\n1999-08-11 eclipse: sun", sunLongitude(e1).toFixed(2), "moon", moonLongitude(e1).toFixed(2));
const e2 = jdOf(2017,8,21,18.43); // 2017-08-21 18:26 UT
console.log("2017-08-21 eclipse: sun", sunLongitude(e2).toFixed(2), "moon", moonLongitude(e2).toFixed(2));
const e3 = jdOf(2024,4,8,18.3); // 2024-04-08 18:18 UT
console.log("2024-04-08 eclipse: sun", sunLongitude(e3).toFixed(2), "moon", moonLongitude(e3).toFixed(2));
