/* =====================================================================
   Contact page — hero glow, pinned hero cover, dithered hand, form.
   ===================================================================== */
(() => {
  "use strict";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const U = () => document.documentElement.clientWidth / 1920;

  /* ---------- hero glow: Figma "Rectangle 12" (blue wave, 300 blur, Lens Distortion shader) rendered by Figma,
     kept as a 48 × 26 colour grid (it is pure blur) and upscaled in a few smooth steps ---------- */
  const GLOW = `w48.
w48.
w48.
w48.
w48.
w27.fffffdw2.fffffdw2.fffffdw1.fffffdfffffdw11.
w24.fffffdw2.fffffdfffffdfffffbfffffbfffffbfffffafffffbfffffbfffffcfffffdfffffdfffffdw9.
w24.fffffcfffffdfffffbfffffafffff9fffef9fffff8fffff7fffff8fffff7fffef9fffffafffffafffffbfffffdfffffcw8.
w22.fffffdfffefbfffefafffef9fffff8fffff7fffef7fffef6fffff5fffff6fffff5fffff5fffff6fffff7fffef7fffff9fffffafffffbfffffcfffffdw1.fffffdw4.
w19.fffefdfffffdfffefcfffffbfffdf9fffdf8fffdf6fffdf5fffdf3fffef2fffef1fffef1fffff1fffff0fffef1fffff2fffff3fffef4fffef6fffff7fffffafffffafffffbfffffdfffffdw4.
w18.fffdfdfffefdfefdfbfffbf9fffbf8fffbf7fffaf3fffaf2fffaf0fffbeefffbecfffcebfffdeafffdeafffeeafffeebfffeecffffeefffef0fffef2fffff4fffff6fffff7fffffafffffafffffcfffffdw3.
w17.fffdfdfffdfdfffbfbfef9f9fef7f7fff7f5fef7f2fff6eefff6ecfff7eafff7e8fff8e6fffae5fffae5fffbe4fffde5fffee6fffee7fffeeafffeebfffeeefffff0fffff3fffff4fffff7fffff9fffffafffffcfffffcw2.
w15.fefdfefefdfefdfafcfdf8fbfcf6f9fcf4f6fbf3f3fbf1effcf0ecfdf0e9fef0e6fef2e3fff4e1fff5e0fff7dffff8defffadffffbe0fffce1fffde2fffde5fffee6fffee8ffffebffffeefffff2fffff5fffff7fffff9fffffafffffcw2.
w14.fdfdfefdfbfefbf9fcf9f6fbf9f4f9f7f1f5f6eef2f6ebedf7e8eaf7e8e5f9e7e3fae8e0fceaddfdeddbfeeedafff2d8fff5d9fff7dafff9dbfffadcfffcdefffde1fffde3fffee4fffee8ffffebffffeefffff2fffff4fffff7fffffafffffafffffcfffffd
w13.fdfdfefbfbfef9f8fdf7f5fbf4f1f8f3ecf5f2e8f1f1e2edf0dfe9f1dde4f2dce0f4dcddf7ded8f9e0d6fae6d4fee9d3feedd3fff1d3fff4d5fff6d6fff7d8fffadafffbdcfffddffffee1fffee3ffffe6ffffeaffffeefffff2fffff5fffff7fffffafffffbfffffc
w12.fdfdfefbfbfef8f8fdf4f4fbf1f0f9ede9f5e9e2f1e6dbece6d6e8e6d1e3e6cfddeaced8ecced5f2d1d2f4d5d0f7dacffae0cffbe6cffdebd0feeed1fef3d2fff6d3fff9d6fffad9fffbdbfffddefffee2fffee3fffee7ffffebffffeefffff2fffef5fffff7fffffafffffa
w11.fcfdfff9fbfdf6f8fcf2f3fbededf8e7e6f5e1def0dcd7ecd9cde5d8c7e2d8c2dddabfd7debed3e3becfe9c2ceeec8cbf3d0cbf7d6cafadecbfde4cdfee9ceffeecffff3d0fff7d3fff9d5fffbd7fffcdafffddefffddfffffe2ffffe6ffffeaffffeefffff2fffff5fffff7fffff9
fbfafdfbfafdfafafcfafafdfafafdfafafdfbfafdfafafdfbfafdfbfafdfafafdf8f8fcf5f5fbf0f1f9e9ecf7e3e5f4dbdcefd3d2ebcdc9e5c8c0e1c7b8dcc7b2d6caaed1d1adced6aecadfb5c8e6bbc7edc2c7f3ccc7f7d5c9faddcafce2cafeebccffeecefef4d0fff7d3fffad6fffad6fffcdafffdddfffee2fffee3fffee7ffffebffffeefffff2fffff4fffff7
f6f6faf5f5faf4f4f9f4f4f9f4f4faf4f4faf5f4faf6f5faf6f6faf6f6faf4f4faf1f2f9eceff7e6e9f5dde1f3d5d9efccd1eac3c5e5bab9e0b5afdbb3a7d5b2a1d1b89ecdc09ec9c79fc7d2a5c6dcadc4e6b6c4edc0c3f3cac5f7d3c7faddc7fee6cafeebcdfff2cffff5cffff6d2fffad4fffbd7fffcdbfffddefffee1fffee4ffffe6ffffeaffffeefffef2fffff4
eeeef7eeeef6ebebf6eaeaf6eaebf6ebebf7ebecf6ededf7eeeef7eeeef7eaebf7e7e8f6e0e5f4d9def1d0d5edc5cde9bcc1e5b1b6e0a6acdaa0a0d59e97d19e92cca68ec9ae8ec5b892c3c498c3d09fc2ddaac2e6b6c2eec0c3f5cbc4fad5c6fcdfc8fde6caffedccfff2cffff6d0fff8d3fffad4fffbd6fffcdafffedffffee2fffee3fffee7fffeeafffeeefffef2
e3e3f2e0e2f1dee0f0dddef0dedff0dedff1dfe1f2dfe2f2e0e2f2dfe2f2dde0f2d9dcf0d1d7edcad1ecbfc8e7b5bde4a7b1dd9ca6d9929cd48d92d18a88cc8b83c89182c69b81c3a786c1b58ac0c494bfd29ec1deaac1e7b6c2f0c1c3f6cec4fad6c7fce1c9fde7cbfdeecefff2cffff5d1fff7d2fff9d6fffbd9fffbdbfffedefffedffffee3fffee6fffeeafffeed
d3d5ecd1d3ebced2eacdd0eacdd0eaced2eacfd2eacfd3ecd0d3ecd0d3ebccd2ebc7cdeac0c8e8b6c1e4adb8e1a1addd94a2d88998d47f8dd07985cc787cc87978c48076c38876c1977abfa582bfb589bfc594bfd39fbfe0abc2e9b8c2f2c3c3f7cec4fad7c7fce1c9fde6cbfeeccefef2cffef3d0fff7d3fff7d5fffad7fffbdbfffcddfffee2fffee3fffee6fffee9
c2c7e6bec2e4bac1e2b7bee2b9bee2b9c1e3bbc2e4bdc2e4bdc4e4bec4e4b9c2e4b3bde3adb7e0a4b1de99a8d98d9ed78194d17789cf6d81cb6879c76773c56970c36e6ec1796ebf8671bf9677bea780beb78abfc795bfd5a0c0e0adc1e9bac2f1c4c3f5cec5f8d8c7fbdfc9fce6cbfeebcefdeecffff3d0fff6d3fff7d5fff9d7fffbdafffcdefffcdffffee2fffde6
acb4dea6aedca3addaa1abdaa1acdba2addba4aedca6afdda6afdda6afdea2aedc9eaada97a5d88d9ed68597d37b8fd07186cd657dc95e76c75b70c5586ac15b69c06267bf6b68be786abe8771be9778bea981beb88abec896bfd4a2bfe0aec1e9bac2eec5c4f3cdc6f7d6c7fadecafce5cafde9cdfeeecffff2d0fff5d3fff6d5fff8d7fffadafffadcfffcdffffce2
95a1d68f9cd48b9ad28a97d28997d28b9ad28c9ad38e9bd48e9ed48e9dd58b9ad38797d28193d17b8ed07387cd6a81cb6079c85974c6546fc45069c14f67bf5164bf5763bf6064be6b67be796bbe8871be9a7abeaa82beba8cbec798bfd4a4c1dfaec1e8bac3eec2c3f3cdc6f7d4c7faddc7fbe2cafde8cdfeebcefff0cffff3d1fff6d3fff7d6fffadafffadcfffbdf
8291d07b8cce778ace7688cc7688cd7689cd778ace788bce798bce788bce768acc7287cd6e84cb687fca617bc95c75c65571c3506dc34c68c14965c04865bf4a62bf4f62be5663be6164be6d6abd7b6ebe8b73be9b7abeab84beb88dbec798bfd3a2c0deadc1e6b6c2eec2c3f3cac5f7d2c6fadac7fde1cafee6cbffebceffeed0fff4d2fff6d3fff7d6fff9d7fffadb`;
  (function glow() {
    const cv = document.querySelector(".cth__glow"); if (!cv) return;
    const W = 48, rows = GLOW.split("\n"), H = rows.length;
    const src = document.createElement("canvas"); src.width = W; src.height = H;
    const sx = src.getContext("2d"), id = sx.createImageData(W, H);
    rows.forEach((r, y) => {
      let x = 0;
      r.replace(/w(\d+)\.|([0-9a-f]{6})/g, (m, n, h) => {
        if (n) { for (let k = 0; k < +n; k++, x++) { const i = (y * W + x) * 4; id.data[i] = id.data[i + 1] = id.data[i + 2] = 255; id.data[i + 3] = 255; } }
        else { const i = (y * W + x) * 4; id.data[i] = parseInt(h.slice(0, 2), 16); id.data[i + 1] = parseInt(h.slice(2, 4), 16); id.data[i + 2] = parseInt(h.slice(4, 6), 16); id.data[i + 3] = 255; x++; }
        return "";
      });
    });
    sx.putImageData(id, 0, 0);
    let cur = src;
    for (let s = 2; s <= 8; s *= 2) {                      // 48 → 96 → 192 → 384: stepwise smoothing, no grid
      const c = s === 8 ? cv : document.createElement("canvas");
      c.width = W * s; c.height = H * s;
      const g = c.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
      g.drawImage(cur, 0, 0, c.width, c.height); cur = c;
    }
  })();

  /* ---------- hand + envelope: the Figma Dither effect (Bayer 4×4, 3 levels, 2 px cells), pre-computed
     from the Figma image, 4 cells per character, runs compressed ---------- */
  const HAND = `!(z!(:!1+

!(z!(71!2-
!(z!(<F
!(z!(5!1+22114
!(z!(<F
!(z!(3!215)
!(z!(<G
!(z!(0!1,2!1+211L5)
!(SFF!(__G
!(R1225!(P1!24Y5)
!(R!F,+!(]RG+
!(QC!2-)!(L!1+22121!2,112Z2)
!(QC!F.!(ZCSF
!(Q4!2.5)!(H!28MQ52
!(Q!F1+!(WlGF+
!(PC!22M!(C!1-21211!2+1!2-YP22
!(PCF!C.!F-+!(SCSFF
!(P4!245,!(>!2<MZ522
!(PFF!+,!F.+FF+!(QlP!F+
!(OC!28)!(:!1,211!27YQ!2+
!(OCFF!C-FF!C/F+!(OpGFCC
!(O4!2955!(51!2?M^5!2+
!(O!F,+!F/!++!F-!(M_SG!F+
!(N1!2-M2MP2M!20M2!(2!1,21!2+1!2/1!20VZ5!2+)
!(N!F,!C+FFG!F,!C,!F,!(LlPFFCC
!(N55!2,MPPQ5P55!2/5,!(/!2D^Q5!2+)
!(MC!F/PFPFFG!F2!(JCSGFF+F+
!(ML!2.MY!P,QMM!2,M22M)!(,2121121!2,1221!2/1!2.jZP!2,)
!(M!F,C!F+PGPOOP!F2+!(IlPFF!C+
!(M55!2,P5YQZQPQPP!5+PP!5+P)1!2G]Q5!2,)
!(LC!F0lGSPPSGG!F,GG!F++!(:+!(4CpP!F++F+
!(L!2/MPYPYQP^!P+MM!P,!2+11!2A1122MZP!2.
!(KC!F,C!F,l!P,pPOOFFOPP+!(JiSPFF!C+
!(KL55!2,!P,!Q,^Q!P,QQ5!2KYZP5!2-
!(K!F2c!P,pS!P,S,!(LpSG!F.
!(K!2/M!P+QPZZzZZYYZ21!2C1!2/MZQ5!2.
!(JC!F+!C+FFOFFPPpPypmPmP!(M_pPFF!C-
!(JO55!2-!P,!Z,w^!Z,5!2LVZQ5!2.
!(J!F1OGGpSpSpq!p,+!(4+!(>+oSG!F/
!(ICM!2/M!P+!Z,wzwZww21!241!2>YZP!2/)
!(I!F.C!F+OPOppPmyy!p,D!(KCpP!F+!C-
!(IP55!2.PPQP^^ZZ!z.N3!2JM^Q55!2.)
!(HC!F2PGGppSpyqzqppH,!(JlSP!F,+F+F+
!(HL!21M!P+z^Zwzw!z,651!2IYZP!20)
!(H!F,CFC!F,OGOppmmypp!y+JO!(JpP!F+!C.
!(H!5+!2.!P+QPz^Zwz^Z!z+9P6!2HM^QP5!2/)
!(G!F4PPFpqppqSS!p+JFp,!(7+!(,+!(2lSPGFF+FF+FF+
!(GM!20MMPPZMvwZzz!Z-6MYZ!2GvZP!22
!(FC!F/C!F,PPFl!p,!P,mSFOp,!(FoPPFF!C/
!(F4!5+!2.!P,YPv!z+^ZQPPZB2PZ^!2F^ZP5!21
!(F!F4GGOGmqqpqS!P,SFFPp,+!(CFpPG!F,++!F,
!(EC!22MMPPMQvzzwzZZPPYZ2MPYZ!201!2;sZQP!22
!(EC!F,!C.!F-Ply!p,!P+mPCFFmpS!(ClpPFF!C1
!(E!5,!2/52!5+Pv!z,^!Z-22PPZZ6!2B]ZQ55!21
!(DC!F/++!F/OmqqpqppSpSS!F.G+(+!(>CpSP!F+++!F.
!(DL!28Mvzzwzw!Z+QM!2.M!2AMZZP!23)
!(D!F.CFCFCC!F/!p+yppSG!F+!C+!F,!(@ipP!F+!C1
!(D5!235!2,55PYwz^Q55!2.!P+25!2?YZQP5!22)
!(C!F3+!F>OGFFO!+,!(:+pSPG!F3
!(CM!2DM!2+M5!2+j6!2=MZZPM!23)
!(BCFFCCFF!C+F!C2!F-CC!F.OF!(+cpC!(<_pP!F+CCF!C/+
!(B45!2C!5+225!2,Mz6!2<V^QP5!23)
!(AC!F4+F+!F<(+(FFpp,!+,!(/+!(-++oSPG!F3++
!(A1!2FM5!2/Mww?!2.1!24wZPP!25
!(A!F/CF!C:FCC!F.(!C+F!p+,!(9CpPP!F+!C2+
!(@155!2BP2!P+!5+!2,P^Zz^!29M^ZQ55!24
!(?C!FHG!F+O!F-S!p+,!++!(.+!(-+lpSG!F5+
!(?1!2EM2M!P-2!M+PZYZwZ!28vZZPM!25
!(>C!F0!C,FCCFCCFC!F.C!F2O!F-PPmpp,!(7ppP!F+!C3F
!(>552!5+!20525!2/P5P!5+!P,Q!P+Y5!P,ZPYZ^^!26M^ZQP5!25
!(=!FIGP!G,PGPGGmSGP!p+,!+-((+!(,+lpSG!F-+F+!F/
!(<LM!2?MMPM!P/Q!P+Y!P,YQPPYZwZ!25vZZPM!26)
!(:C!F6!C+FFCFC!F4O!P+OPO!P,OmPFFOmppP!(3CopP!F,!C3F
!(91!5-!2+5!25552525!P1Z!Q,!Z+QZZQ5PPYZ^^!24^ZQP5!26)
!(7C!F;+!F3GFGGPG!P/SPSSppP!F+P!p+S!++!(++((+FpSGG!F.+!F0
!(6!2,M!2<M22!M,!P/!Y+!Z2Q22MPYZww6!21sZZPP!27)
!(4!F2CC!F/CFFC!F2OOPOO!P-mmpmm!P,mpP!F,OmppS!(1lpPP!F,!C4+
!(21255!2,5!2/55!2,5!2-5PP5!P,ZQQPQ!Z2QPZz^Q525PPZZzz6!20]^QP55!26)
!(0C!FIGGPPS!P,SS!p/SPSppSG!F-P!p+S!+-(+FpSPG!F8+
!(/!2F!M+!P-YZZY!Z5wzzZ5!2+MMPYZww6!2.MZZQP!29
!(-C!F1!C+F!C/!F+C!F4OOPmmP!m,!p5PFFCCFFOPm!p+!(,C(ipPP!F.!C2F+
!(,4552255!2<!5/!P-Q!Z8!z+^^Q5!2,!P+ZZ^^6!2-Y^ZQP55!27
!(+!F:+F+!F8!P-S!p6qqppSG!F/GP!p,,!+,ppSGG!F8+
(L2M!2DMM2M22M!P+YY!Z/wzzw!z/ZZPP!2-MMPPYZwwZ!2+M!Z+PM!29
!F1C!F,CC!F+!C0!F5OPPmmpm!p+mP!p-y!p,mPPFF!C,!F+OPm!p+,((ipSP!F,!C+!F+CF!C,FCF
!5-!2+525!29525!P,!5+!P+!Z,^!Z/!z-!^+ZZQP5!2.5!P+ZZ!^+22v^ZQP55!28
!F;!+-!F1G!F.GPP!p,S!p+SPpqpqqzpSPPGG!F++!F.PP!p,GFppSPG!F:
MM!2CM2M!P+!M,PPY!Z-wzw!Z,!z-ZZ!P+M!20MMPPZZ!w-ZZPP!2:)
!F,CC!F1!C+F!C/!F6OOpm!p/mPmyp!y+PPO!F,!C-!F-OPm!p.PP!F,!C-!F,CC!F,
55!2.5!2,55!2455!P4QY^ZZ!z,^!Z+!z-Q!P+55!205!P,ZZ!^,ZQP!5+!28)
!FGGFFGFGGFG!P+ppS!p.Sppz!q+PG!F.++!F0PP!p-SPG!F;
!2?M2!M,!P4YQYww!z-!Z+w!z,PPM!23!M+PPYZZw!Z+PPM!2:)
!FGO!F,!O+!P-mm!p1yyppG!F-!C.FC!F-OPm!p+PP!F-!C.!F.CFF+
225!2+5522!52!P;YQ!Z,B^!z,!^+!z-Q!5+!245!P+!Z+^ZZP55!2:)
!F>!G/!P+!G,!P,SP!p+/i!p1qqpG!F/++FF+!F.GPPppSPGG!F;+
!21M2!M2!P9!Z.-((Zwwz!w-zzwQ!29MPPY!Z+PPM!2;)
FC!F;!O-PO!P-!O+!P,mppm!(,!p3GFFCF!C1FC!F,OO!P,!F-!C+!F+CC!F,C!F++
!2-52!5-!P7!Q+Z!Q-!Z.^-!(-X!z,^Zzz^65!285!P+ZZQPP!5+!245!2,5
!F6!G0!P7S!p,S)!(.!p1J!F.+F+!F3G!P+GG!F<+
!2/!M.!P5YYZZYZ!Y+!Z/?!(/U!w+!Z+wZ6!2:MM!P.!2=
!F6OO!P:!m+pmppm,!(0!p,mPmpP!C7FC!F,!O+!F-!C-!F,C!F-CFF
!2+!5+!P2!Q.!Z9^ZZ!(1U!^+!Z+^6!2;!P.!5+!215!21
!F4GG!P1!S/pSS!p0/!(2!p+SPPpS!F,!+,F+!F++!F0GG!F?
!2+!M.!P/YY!Z?!(3U!Z,Pv?!2<MMPPMM!2=
!F4!O+!P,!m1pmmpmm!p-m,!(4mpSPFlSCF!C7!FF
!5,!P4Q!Z8!^-ZZ!(5CZZQPP^!2;55!P+!5+!2-5225255!2+52522)
!F0!G+!P/!p<S8!(6pSPGFpFF+F+!F,++F+!FJ
!M-!P3Y!Z>*!(6XZQPPY!2=!M+!2?)
!F.!O-!P.mmppmppm!p1!m,p!(7iS!P+pF!C8FC!FD+
5!P5QQ!Z6^!Z.^?!(8ZZQQw3!2<!5-25225!2,52!512,
!F-GG!P2SS!p6SS!p+/!(8RSSPpGF++F++F++!FM+
M!P3YPYP!Z9wZZwZ!(9C!Z,3!2?M!26!M+!2-)
!F-OO!P1!m+!p3!m+!p,5!(:mpmpG!C0F!C1!FD+
!P0!Q-!Z1^ZZ^^!Z,^z^!Z+-!(:UZZH6!2=!5-252!58P5
!G,!P2SS!p<S!(<op)G!F1+!FL,
!P0!Y,!Z@?!(?1!2J!M+2!M/P)
FOPOO!P0m!p+!m.pp!m,!p,mmp)!(?!C6FCFCC!FBO
!P-QQZQ!Z>^!Z+?!(A!2;!5<!P,5
G!P2S!p+!S-!p/S!p//!(@C!FR5
!P-!Y,!ZB!(B!2CM!2,!M0P5
OO!P7mm!p,!m-!p+!m+)!(A!C4FCFC!F@O,
!P-QQ!Z6^!Z3?!(C!2;!59!P+,
!P/SS!P.S!p-Spp!S+!p,SS!(DF+!F++!FGG)
!P-YY!Z-PY!Z:*!(D!2>M2!M+2!M/PP)
!O+!P2mm!p-!m-!(+_mm!(F!C1!FBO
!P+QP!Z5^!Z-!(M!28!52P55!P.
!P4!p0Spp)!(M!FI5
!P,!Y+ZZYY!Z3*!(N1!28M2MM2!M1P5
!P2m!p/!m+,!(OF!C-FCFC!F=+
PQQZQZQ!Z5?!(P1!27!5/!P/)
!P0S!p/SpSS!(QC!FCG)
PP!Y-!Z4*!(Q1!28M2!M/PP)
!P1!m1,!(R!C,FCFC!F;
QQZQ!Z5?!(S1!2452!5.!P-
!P/!S,pSppSS!(TC!F?,
PYYZZY!Z2-!(U!28!M,PP5
!P1!m.5!(U!C.!F8+
QQ!Z5!(W!2152!5,P5!P+,
!P+SSP!S,ppSS/!(W!F;)
!Y+!Z2?!(X!23M2!M,P)
!P-!m0!(Y!C,!F5
!Z4-!(Y!2.!5.!P,
PPSS!p.S8!(Z!F6G
ZY!Z1*!(Z1!2/M2MMP5
PP!m,pmpm,!([!C+!F1+
!Z2!(]1!2,!5+!P+,
!S+!p-S)!(]C!F1
!Z0?!(^1!2+!M-)
!m+pp!m+!(_CC!F.
!Z+^!Z+*!(_1255P5P
!p-S8!(aC!F-
!Z.!(c!M+5
!p,m,!(bCFF+
!Z,?!(dP,
!p+S)!(d,
!Z+-
pmm
ZZ*
p8
Z
,`;
  (function hand() {
    const box = document.querySelector(".ctf__hand"), cv = box && box.querySelector("canvas"); if (!cv) return;
    const A = []; for (let c = 40; c <= 125; c++) if (c !== 92 && c !== 96) A.push(String.fromCharCode(c));
    const IX = {}; A.forEach((ch, i) => (IX[ch] = i));
    const W = 457, H = 207, Y0 = 14, g = cv.getContext("2d"), id = g.createImageData(W, H), d = id.data;
    HAND.split("\n").forEach((r, ri) => {
      const y = Y0 + ri; let k = 0;
      const put = (ch) => {
        let v = IX[ch];
        for (let j = 0; j < 4; j++, v = (v / 3) | 0) {
          const s = v % 3, x = k * 4 + j;
          if (!s || x >= W) continue;
          const i = (y * W + x) * 4, c = s === 1 ? 128 : 0;
          d[i] = d[i + 1] = d[i + 2] = c; d[i + 3] = 255;
        }
        k++;
      };
      for (let i = 0; i < r.length;) {
        if (r[i] === "!") { const ch = r[i + 1], n = IX[r[i + 2]]; for (let t = 0; t < n; t++) put(ch); i += 3; }
        else { put(r[i]); i++; }
      }
    });
    g.putImageData(id, 0, 0);
    new IntersectionObserver(([e]) => { if (e.isIntersecting) box.classList.add("is-in"); }, { threshold: 0.25 }).observe(box);

    /* the hand shies away from the cursor: within reach it is pushed off along the line from the pointer,
       with a slight turn, and springs back when the cursor leaves */
    const push = box.querySelector(".ctf__handp");
    if (REDUCED || !push || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let mx = -1e5, my = -1e5, x = 0, y = 0, r = 0, vx = 0, vy = 0, vr = 0, on = false, raf = 0, last = 0;
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); }, { rootMargin: "10% 0px" }).observe(box);
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; if (on && !raf) raf = requestAnimationFrame(tick); }, { passive: true });
    document.addEventListener("pointerleave", () => { mx = my = -1e5; });
    function tick(now) {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
      const k = U(), b = cv.getBoundingClientRect();
      // nearest point on the hand's box, so the push starts at the edge of the image rather than its centre
      const cx = Math.max(b.left, Math.min(mx, b.right)), cy = Math.max(b.top, Math.min(my, b.bottom));
      const ox = b.left + b.width * 0.55, oy = b.top + b.height * 0.5;
      const reach = 170 * k, dEdge = Math.hypot(mx - cx, my - cy);
      let tx = 0, ty = 0, tr = 0;
      if (dEdge < reach) {
        const f = Math.pow(1 - dEdge / reach, 2), dx = ox - mx, dy = oy - my, d = Math.hypot(dx, dy) || 1, s = 13 * k * (0.35 + 0.65 * f);
        tx = (dx / d) * s * (dEdge < reach ? 1 : 0) * Math.min(1, f * 1.6 + 0.15);
        ty = (dy / d) * s * Math.min(1, f * 1.6 + 0.15);
        tr = Math.max(-0.7, Math.min(0.7, (dy / d) * -0.6 * f + (dx / d) * 0.25 * f));
      }
      // soft spring (slightly underdamped, so it settles with a little give)
      const K = 45, D = 13;   // gentle, critically damped: no overshoot
      vx += ((tx - x) * K - vx * D) * dt; x += vx * dt;
      vy += ((ty - y) * K - vy * D) * dt; y += vy * dt;
      vr += ((tr - r) * K - vr * D) * dt; r += vr * dt;
      push.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      push.style.rotate = `${r.toFixed(3)}deg`;
      const moving = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) + Math.abs(vr) > 0.02;
      if (on && (moving || dEdge < reach)) raf = requestAnimationFrame(tick); else last = 0;
    }
  })();

  /* ---------- hero: pinned in place while the page slides over it; nothing in it moves, scales or fades ---------- */
  (function hero() {
    const hero = document.querySelector(".cth"); if (!hero) return;
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-on")));
    /* a subtle "VR" camera move: as the page comes up, the globe layer tips back in perspective and the
       globe itself dollies in and turns to show its top. Only the transparent globe layer moves, so the
       frame (header, lines, glow) stays edge to edge. A light black overlay (up to 8 %) settles over the hero. */
    const og = hero.querySelector(".og--hero"), dim = hero.querySelector(".cth__dim"), main = document.getElementById("main");
    // copy sinks with the scroll at a fraction of its speed (the globe a little less), so the hero settles away under the page
    const sink = [[hero.querySelector(".cth__title"), 0.1], [hero.querySelector(".cth__intro"), 0.07], [hero.querySelector(".cth__hint"), 0.07]];
    // the side lines drift the other way (up), a touch, to balance the copy sinking
    const lines = [...hero.querySelectorAll(".b30h__vline--26,.b30h__vline--27")].map((el) => [el, -0.05]);
    sink.length = 0;   // (the copy and lines hold still: nothing in the hero is pushed down by the scroll)
    let cs = 0, last = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const vh = hero.querySelector(".b30h__pin").offsetHeight, c = clamp((vh - main.getBoundingClientRect().top) / vh);
      cs = REDUCED ? c : cs + (c - cs) * (1 - Math.exp(-dt * 6));
      if (Math.abs(c - cs) < 0.0004) cs = c;
      window.__cthC = REDUCED ? 0 : cs;
      if (!REDUCED) og.style.transform = cs > 0.0005 ? `perspective(1600px) rotateX(${(cs * 9).toFixed(3)}deg) translate3d(0,${(cs * vh * 0.06).toFixed(2)}px,0)` : "";
      if (!REDUCED) sink.forEach(([el, k]) => { if (el) el.style.translate = cs > 0.0005 ? `0 ${(cs * vh * k).toFixed(2)}px` : ""; });
      dim.style.opacity = (0.08 * easeIO(cs)).toFixed(4);
    }
    requestAnimationFrame(frame);
  })();

<<<<<<< HEAD
  /* ---------- form: validation, then off to the contact form API (emails ahmad.hassan@breakthirty.com);
     sends with Netlify Forms (or the PUBLIC_FORM_ENDPOINT API); off Netlify it falls back to a pre-filled email ---------- */
  (function form() {
    const STARTED = Date.now();   // the API drops forms sent in under 3 seconds (bots)
=======
  /* ---------- form: validation, then a pre-filled email to hello@breakthirty.com ---------- */
  (function form() {
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    const f = document.querySelector(".ctf__form"); if (!f) return;
    // where the message goes and what the form says: src/data/contact.js (form)
    const FORM = (window.B30_CONTENT.contactPage || {}).form || {}, MSG = FORM.messages || {};
    const status = f.querySelector(".ctf__status"), btn = f.querySelector(".ctf__send"), lbl = btn.querySelector("[data-lbl]");
    const need = f.querySelector(".ctf__need"), hand = document.querySelector(".ctf__hand");
    const field = (n) => f.elements[n];
<<<<<<< HEAD
    // (a scramble still running puts its own text back when it ends, so a new message waits for it to finish)
    const say = (t, err) => { if (status._scr) { setTimeout(() => say(t, err), 60); return; } status.textContent = t; status.classList.toggle("is-err", !!err); if (window.B30 && B30.scramble && t) B30.scramble(status, { mode: "reveal", duration: 600, stagger: 0.6 }); };
=======
    const say = (t, err) => { status.textContent = t; status.classList.toggle("is-err", !!err); if (window.B30 && B30.scramble && t) B30.scramble(status, { mode: "reveal", duration: 600, stagger: 0.6 }); };
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    f.addEventListener("input", (e) => { const l = e.target.closest(".ctf__f"); l && l.classList.remove("is-err"); if (e.target.name === "need") need.classList.remove("is-err"); });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = field("name").value.trim(), email = field("email").value.trim(), company = field("company").value.trim(), phone = field("phone").value.trim();
      const needs = [...f.querySelectorAll('input[name="need"]:checked')].map((x) => x.value), details = field("details").value.trim();
      const bad = [];
      if (!name) bad.push(field("name"));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad.push(field("email"));
      const badPhone = phone && phone.replace(/\D/g, "").length < 7; if (badPhone) bad.push(field("phone"));
      bad.forEach((x) => x.closest(".ctf__f").classList.add("is-err"));
      if (bad.length) { bad[0].focus(); say(!name ? MSG.noName : bad[0] === field("email") ? MSG.badEmail : MSG.badPhone, true); return; }
<<<<<<< HEAD
      const subject = `${FORM.subject} — ${company || name}`;
      const mailto = () => {
        const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, company ? `Company: ${company}` : null, needs.length ? `Needs: ${needs.join(", ")}` : null, "", details || MSG.noDetails].filter((x) => x !== null).join("\n");
        location.href = `mailto:${FORM.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      };
      btn.disabled = true;
      hand && hand.classList.add("is-sent");
      const done = (ms) => setTimeout(() => { btn.disabled = false; hand && hand.classList.remove("is-sent"); }, ms);

      const sent = () => {
        say(MSG.sent); f.reset(); done(1600);
        window.dataLayer && window.dataLayer.push({ event: "contact_form_submit" });   // for Google Tag Manager
        window.gtag && window.gtag("event", "generate_lead", { form_name: "contact" });   // Google Analytics 4 (a recommended "lead" event)
      };
      const openMail = () => { say(MSG.opening); setTimeout(() => { mailto(); done(1600); }, REDUCED ? 0 : 650); };

      // Netlify Forms (no API address set): post the form to Netlify, which emails it to the team
      if (!FORM.endpoint) {
        if (field("website") && field("website").value) { sent(); return; }   // a bot filled the hidden field: pretend, send nothing
        say(MSG.sending);
        const data = new URLSearchParams();
        data.append("form-name", FORM.netlifyForm || "contact");
        data.append("subject", `${subject} (breakthirty.com)`);
        [["name", name], ["email", email], ["phone", phone], ["company", company], ["needs", needs.join(", ")], ["details", details || MSG.noDetails]].forEach(([k, v]) => data.append(k, v));
        const ctrl = "AbortController" in window ? new AbortController() : null, timer = ctrl && setTimeout(() => ctrl.abort(), 15000);
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data.toString(), signal: ctrl ? ctrl.signal : undefined })
          .then((r) => {
            clearTimeout(timer);
            if (r.ok) return sent();
            if (r.status === 404 || r.status === 405) return openMail();   // not on Netlify (e.g. npm run dev): the email app instead
            say(MSG.failed, true); done(0);
          })
          .catch(() => { clearTimeout(timer); say(MSG.failed, true); done(0); });
        return;
      }
      // the form API (AWS Lambda): it emails the team, Reply-To the visitor
      say(MSG.sending);
      const ctrl = "AbortController" in window ? new AbortController() : null, timer = ctrl && setTimeout(() => ctrl.abort(), 15000);
      fetch(FORM.endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl ? ctrl.signal : undefined,
        body: JSON.stringify({ name, email, phone, company, needs, details, website: field("website") ? field("website").value : "", startedAt: STARTED }),
      })
        .then((r) => r.json().catch(() => ({})).then((j) => ({ ok: r.ok && j.ok, status: r.status, j })))
        .then(({ ok, status, j }) => {
          clearTimeout(timer);
          if (ok) return sent();
          if (status === 400 && j.fields) {           // the API disagreed with something: mark it
            j.fields.forEach((n) => { const el = field(n); el && el.closest(".ctf__f") && el.closest(".ctf__f").classList.add("is-err"); });
            say(j.fields.includes("email") ? MSG.badEmail : j.fields.includes("name") ? MSG.noName : j.fields.includes("phone") ? MSG.badPhone : MSG.check, true);
          } else say(MSG.failed, true);
          done(0);
        })
        .catch(() => { clearTimeout(timer); say(MSG.failed, true); done(0); });
=======
      const body = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null, company ? `Company: ${company}` : null, needs.length ? `Needs: ${needs.join(", ")}` : null, "", details || MSG.noDetails].filter((x) => x !== null).join("\n");
      const subject = `${FORM.subject} — ${company || name}`;
      say(MSG.sending);
      hand && hand.classList.add("is-sent");
      btn.disabled = true;
      setTimeout(() => {
        location.href = `mailto:${FORM.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setTimeout(() => { btn.disabled = false; hand && hand.classList.remove("is-sent"); }, 1600);
      }, REDUCED ? 0 : 650);
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    });
  })();
})();
