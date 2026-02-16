import type { Unterrichtsablauf } from '../unterrichtsablauf'

export const unterrichtsAblaufToRtf = (ablauf: Unterrichtsablauf): string => {
  const nichtLetzteSpalte =
    '}\\cell\\pard\\plain \\s38\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\nowidctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\intbl\\ql\\ltrpar{\\loch'
  const letzteSpalteAberNichtLetzeZeile =
    '}$\\cell\\row\\pard \\trowd\\trql\\trleft5\\ltrrow\\trpaddft3\\trpaddt0\\trpaddfl3\\trpaddl0\\trpaddfb3\\trpaddb0\\trpaddfr3\\trpaddr0\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\cellx1082\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\cellx3182\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\cellx7234\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clbrdrr\\brdrs\\brdrw10\\brdrcf1\\clpadfr3\\clpadr55\\cellx9642\\pard\\plain \\s38\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\nowidctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\intbl\\qr\\ltrpar{\\loch'
  const letzteSpalteLetzteZeile =
    '}\\cell\\row\\pard \\pard\\plain \\s3\\rtlch\\af9\\afs28\\alang1081\\ab \\ltrch\\lang1075\\langfe2052\\hich\\af4\\loch\\ql\\widctlpar\\hyphpar0\\sb140\\sa120\\keepn\\ltrpar\\cf0\\f4\\fs28\\lang1075\\b\\kerning1\\dbch\\af6\\langfe2052{\\listtext\\pard\\plain }\\ilvl2\\ls2 \\fi0\\li0\\lin0\\ql\\fi0\\li0\\lin0\\ltrpar{\\loch'
  const allerLetzteZelle =
    '}\\cell\\row\\pard \\pard\\plain \\s34\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\sl276\\slmult1\\widctlpar\\hyphpar0\\sb0\\sa140\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\sl276\\slmult1\\ql\\ltrpar\\loch'

  return `{\\rtf1\\ansi\\deff3\\adeflang1025
{\\fonttbl{\\f0\\froman\\fprq2\\fcharset0 Times New Roman;}{\\f1\\froman\\fprq2\\fcharset2 Symbol;}{\\f2\\fswiss\\fprq2\\fcharset0 Arial;}{\\f3\\froman\\fprq2\\fcharset0 Liberation Serif{\\*\\falt Times New Roman};}{\\f4\\fnil\\fprq0\\fcharset2 OpenSymbol{\\*\\falt Arial Unicode MS};}{\\f5\\fswiss\\fprq2\\fcharset0 Liberation Sans{\\*\\falt Arial};}{\\f6\\fnil\\fprq2\\fcharset0 Noto Sans CJK SC;}{\\f7\\fswiss\\fprq0\\fcharset128 Noto Sans Devanagari;}{\\f8\\fnil\\fprq2\\fcharset0 Noto Sans Devanagari;}}
{\\colortbl;\\red0\\green0\\blue0;\\red0\\green0\\blue255;\\red0\\green255\\blue255;\\red0\\green255\\blue0;\\red255\\green0\\blue255;\\red255\\green0\\blue0;\\red255\\green255\\blue0;\\red255\\green255\\blue255;\\red0\\green0\\blue128;\\red0\\green128\\blue128;\\red0\\green128\\blue0;\\red128\\green0\\blue128;\\red128\\green0\\blue0;\\red128\\green128\\blue0;\\red128\\green128\\blue128;\\red192\\green192\\blue192;}
{\\stylesheet{\\s0\\snext0\\rtlch\\af8\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\widctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af9\\langfe2052 Normal;}
{\\s1\\sbasedon16\\snext17\\rtlch\\af8\\afs36\\ab \\ltrch\\hich\\af5\\loch\\ilvl0\\outlinelevel0\\sb240\\sa120\\keepn\\f5\\fs36\\b\\dbch\\af6 Heading 1;}
{\\s2\\sbasedon16\\snext17\\rtlch\\af8\\afs32\\ab \\ltrch\\hich\\af5\\loch\\ilvl1\\outlinelevel1\\sb200\\sa120\\keepn\\f5\\fs32\\b\\dbch\\af6 Heading 2;}
{\\s3\\sbasedon16\\snext17\\rtlch\\af8\\afs28\\ab \\ltrch\\hich\\af5\\loch\\ilvl2\\outlinelevel2\\sb140\\sa120\\keepn\\f5\\fs28\\b\\dbch\\af6 Heading 3;}
{\\*\\cs15\\snext15\\rtlch\\af4 \\ltrch\\hich\\af4\\loch\\f4\\dbch\\af4 Bullets;}
{\\s16\\sbasedon0\\snext17\\rtlch\\af8\\afs28 \\ltrch\\hich\\af5\\loch\\sb240\\sa120\\keepn\\f5\\fs28\\dbch\\af6 Heading;}
{\\s17\\sbasedon0\\snext17\\loch\\sl276\\slmult1\\sb0\\sa140 Body Text;}
{\\s18\\sbasedon17\\snext18\\rtlch\\af7 \\ltrch\\loch\\sl276\\slmult1\\sb0\\sa140 List;}
{\\s19\\sbasedon0\\snext19\\rtlch\\af7\\afs24\\ai \\ltrch\\loch\\sb120\\sa120\\noline\\fs24\\i Caption;}
{\\s20\\sbasedon0\\snext20\\rtlch\\af7 \\ltrch\\loch\\noline Index;}
{\\s21\\sbasedon0\\snext21\\loch\\nowidctlpar\\noline Table Contents;}
}{\\*\\listtable{\\list\\listtemplateid1
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}
{\\listlevel\\levelnfc255\\leveljc0\\levelstartat1\\levelfollow2{\\leveltext \\'00;}{\\levelnumbers;}\\fi0\\li0}\\listid1}
{\\list\\listtemplateid2
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u8226 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li720}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9702 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li1080}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9642 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li1440}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u8226 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li1800}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9702 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li2160}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9642 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li2520}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u8226 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li2880}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9702 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li3240}
{\\listlevel\\levelnfc23\\leveljc0\\levelstartat1\\levelfollow0{\\leveltext \\'01\\u9642 ?;}{\\levelnumbers;}\\f4\\rtlch\\af4 \\ltrch\\loch\\fi-360\\li3600}\\listid2}
}{\\listoverridetable{\\listoverride\\listid1\\listoverridecount0\\ls1}{\\listoverride\\listid2\\listoverridecount0\\ls2}}{\\*\\generator LibreOffice/24.2.7.2$Linux_X86_64 LibreOffice_project/420$Build-2}{\\info{\\creatim\\yr2026\\mo2\\dy16\\hr20\\min59}{\\revtim\\yr2026\\mo2\\dy16\\hr21\\min3}{\\printim\\yr0\\mo0\\dy0\\hr0\\min0}}{\\*\\userprops}\\deftab709
\\hyphauto1\\viewscale110\\formshade\\nobrkwrptbl\\paperh16838\\paperw11906\\margl1134\\margr1134\\margt1134\\margb1134\\sectd\\sbknone\\sftnnar\\saftnnrlc\\sectunlocked1\\pgwsxn11906\\pghsxn16838\\marglsxn1134\\margrsxn1134\\margtsxn1134\\margbsxn1134\\ftnbj\\ftnstart1\\ftnrstcont\\ftnnar\\aenddoc\\aftnrstcont\\aftnstart1\\aftnnrlc
{\\*\\ftnsep\\chftnsep}\\pgndec\\pard\\plain \\s1\\rtlch\\af8\\afs36\\ab \\ltrch\\hich\\af5\\loch\\ilvl0\\outlinelevel0\\sb240\\sa120\\keepn\\f5\\fs36\\b\\dbch\\af6{\\listtext\\pard\\plain \\tab}\\ls1 \\fi0\\li0\\lin0\\ql\\fi0\\li0\\lin0\\sb240\\sa120\\ltrpar{\\loch
${ablauf.thema}}
\\par \\pard\\plain \\s2\\rtlch\\af8\\afs32\\ab \\ltrch\\hich\\af5\\loch\\ilvl1\\outlinelevel1\\sb200\\sa120\\keepn\\f5\\fs32\\b\\dbch\\af6{\\listtext\\pard\\plain \\tab}\\ls1 \\fi0\\li0\\lin0\\ql\\fi0\\li0\\lin0\\ltrpar{\\loch
Lernziele}
${ablauf.lernziele
  .map(
    (
      lz
    ) => `\\par \\pard\\plain \\s17\\loch\\sl276\\slmult1\\sb0\\sa140{\\listtext\\pard\\plain \\rtlch\\af4 \\ltrch\\hich\\af4\\loch\\f4\\dbch\\af4 \\u8226\\'95\\tab}\\ilvl0\\ls2 \\fi-360\\li720\\lin720\\ql\\ltrpar{\\loch
${lz}}`
  )
  .join('\n')}
\\par \\pard\\plain \\s2\\rtlch\\af8\\afs32\\ab \\ltrch\\hich\\af5\\loch\\ilvl1\\outlinelevel1\\sb200\\sa120\\keepn\\f5\\fs32\\b\\dbch\\af6{\\listtext\\pard\\plain \\tab}\\ls1 \\fi0\\li0\\lin0\\ql\\fi0\\li0\\lin0\\ltrpar{\\loch
Ablaufplan}
\\par \\pard\\plain \\s3\\rtlch\\af8\\afs28\\ab \\ltrch\\hich\\af5\\loch\\ilvl2\\outlinelevel2\\sb140\\sa120\\keepn\\f5\\fs28\\b\\dbch\\af6{\\listtext\\pard\\plain \\tab}\\ls1 \\fi0\\li0\\lin0\\ql\\fi0\\li0\\lin0\\ltrpar{\\loch
Einstiegsphase}
\\par \\trowd\\trql\\trleft5\\ltrrow\\trpaddft3\\trpaddt0\\trpaddfl3\\trpaddl0\\trpaddfb3\\trpaddb0\\trpaddfr3\\trpaddr0\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx1082\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx3182\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx7234\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clbrdrr\\brdrs\\brdrw10\\brdrcf1\\clpadfr3\\clpadr55\\clcbpat15\\cellx9642\\pard\\plain \\s38\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\nowidctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\intbl\\ql\\ltrpar{\\loch
Dauer${nichtLetzteSpalte}
Ziel${nichtLetzteSpalte}
Beschreibung${nichtLetzteSpalte}
Material${letzteSpalteAberNichtLetzeZeile}

${ablauf.einstiegsphase
  .map(
    (a, idx) => `
${a.dauer}${nichtLetzteSpalte}
${a.ziel}${nichtLetzteSpalte}
${a.beschreibung}${nichtLetzteSpalte}
${a.material}${idx < ablauf.einstiegsphase.length - 1 ? letzteSpalteAberNichtLetzeZeile : letzteSpalteLetzteZeile}`
  )
  .join('/n')}

Erarbeitungsphase}
\\par \\trowd\\trql\\trleft5\\ltrrow\\trpaddft3\\trpaddt0\\trpaddfl3\\trpaddl0\\trpaddfb3\\trpaddb0\\trpaddfr3\\trpaddr0\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx1082\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx3182\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx7234\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clbrdrr\\brdrs\\brdrw10\\brdrcf1\\clpadfr3\\clpadr55\\clcbpat15\\cellx9642\\pard\\plain \\s38\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\nowidctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\intbl\\ql\\ltrpar{\\loch
Dauer${nichtLetzteSpalte}
Ziel${nichtLetzteSpalte}
Beschreibung${nichtLetzteSpalte}
Material${letzteSpalteAberNichtLetzeZeile}
${ablauf.erarbeitungsphase
  .map(
    (a, idx) => `
${a.dauer}${nichtLetzteSpalte}
${a.ziel}${nichtLetzteSpalte}
${a.beschreibung}${nichtLetzteSpalte}
${a.material}${idx < ablauf.erarbeitungsphase.length - 1 ? letzteSpalteAberNichtLetzeZeile : letzteSpalteLetzteZeile}`
  )
  .join('/n')}
Sicherungsphase}
\\par \\trowd\\trql\\trleft5\\ltrrow\\trpaddft3\\trpaddt0\\trpaddfl3\\trpaddl0\\trpaddfb3\\trpaddb0\\trpaddfr3\\trpaddr0\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx1082\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx3182\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clpadfr3\\clpadr55\\clcbpat15\\cellx7234\\clbrdrt\\brdrs\\brdrw10\\brdrcf1\\clpadfl3\\clpadl55\\clbrdrl\\brdrs\\brdrw10\\brdrcf1\\clpadft3\\clpadt55\\clbrdrb\\brdrs\\brdrw10\\brdrcf1\\clpadfb3\\clpadb55\\clbrdrr\\brdrs\\brdrw10\\brdrcf1\\clpadfr3\\clpadr55\\clcbpat15\\cellx9642\\pard\\plain \\s38\\rtlch\\af9\\afs24\\alang1081 \\ltrch\\lang1075\\langfe2052\\hich\\af3\\loch\\ql\\nowidctlpar\\hyphpar0\\ltrpar\\cf0\\f3\\fs24\\lang1075\\kerning1\\dbch\\af7\\langfe2052\\intbl\\ql\\ltrpar{\\loch
Dauer${nichtLetzteSpalte}
Ziel${nichtLetzteSpalte}
Beschreibung${nichtLetzteSpalte}
Material${letzteSpalteAberNichtLetzeZeile}
${ablauf.sicherungsphase
  .map(
    (a, idx) => `
${a.dauer}${nichtLetzteSpalte}
${a.ziel}${nichtLetzteSpalte}
${a.beschreibung}${nichtLetzteSpalte}
${a.material}${idx < ablauf.sicherungsphase.length - 1 ? letzteSpalteAberNichtLetzeZeile : allerLetzteZelle}`
  )
  .join('/n')}


\\par \\pard\\plain \\s17\\loch\\sl276\\slmult1\\sb0\\sa140\\ql\\sb0\\sa140\\ltrpar\\loch

\\par }`
}
