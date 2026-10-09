#!/usr/bin/env python3
"""
Generates the site's illustrations as SVG files in public/images/.
Brand palette matches the logo: crimson #820A14, maroon #3A0212, gold #E8AE45 / #FBD596.

Run:  python3 scripts/generate-illustrations.py
"""
import math
import os
import random

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
W, H = 1600, 900

CRIMSON = '#820A14'
DEEP = '#6C020E'
MAROON = '#3A0212'
NIGHT = '#1C0107'
GOLD = '#E8AE45'
GOLD_L = '#FBD596'
CREAM = '#FBF4EA'
NAVY = '#1B1035'
SKIN = '#F4B13C'
SKIN_D = '#E58A22'
GREEN = '#3E8E41'


# ---------------------------------------------------------------- primitives

def defs(extra=''):
    return f'''<defs>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
  <filter id="haze" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="60"/></filter>
  <radialGradient id="faceG" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#FFD36B"/><stop offset="0.6" stop-color="{SKIN}"/><stop offset="1" stop-color="{SKIN_D}"/></radialGradient>
  <radialGradient id="haloG" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{GOLD_L}" stop-opacity="0.95"/><stop offset="0.55" stop-color="{GOLD}" stop-opacity="0.55"/><stop offset="1" stop-color="{CRIMSON}" stop-opacity="0"/></radialGradient>
  <radialGradient id="sanctum" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="#FFB547"/><stop offset="0.45" stop-color="#C2410C"/><stop offset="1" stop-color="{MAROON}"/></radialGradient>
  <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GOLD_L}"/><stop offset="1" stop-color="#C98A1E"/></linearGradient>
  <linearGradient id="crimsonV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A3121F"/><stop offset="1" stop-color="{DEEP}"/></linearGradient>
  <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{MAROON}" stop-opacity="0"/><stop offset="0.5" stop-color="{NIGHT}" stop-opacity="0.75"/><stop offset="1" stop-color="{NIGHT}" stop-opacity="0.95"/></linearGradient>
  {extra}
</defs>'''


def svg(body, extra_defs='', w=W, h=H):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'preserveAspectRatio="xMidYMid slice">{defs(extra_defs)}{body}</svg>')


def sky(top, mid, bottom, gid='sky'):
    return (f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/>'
            f'<stop offset="0.55" stop-color="{mid}"/><stop offset="1" stop-color="{bottom}"/></linearGradient>',
            f'<rect width="{W}" height="{H}" fill="url(#{gid})"/>')


def mandala(cx, cy, r, color=GOLD, op=0.18):
    out = [f'<g opacity="{op}" fill="none" stroke="{color}">']
    for i, rr in enumerate([r, r * .86, r * .7, r * .5, r * .3]):
        dash = ' stroke-dasharray="4 6"' if i % 2 else ''
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{rr:.0f}" stroke-width="2"{dash}/>')
    n = 24
    for i in range(n):
        a = i * 360 / n
        out.append(f'<path transform="rotate({a} {cx} {cy})" d="M{cx},{cy - r} C{cx - 14},{cy - r * .86} {cx - 10},{cy - r * .72} {cx},{cy - r * .7} '
                   f'C{cx + 10},{cy - r * .72} {cx + 14},{cy - r * .86} {cx},{cy - r}Z" stroke-width="2"/>')
    for i in range(16):
        a = i * 360 / 16
        out.append(f'<path transform="rotate({a} {cx} {cy})" d="M{cx},{cy - r * .5} Q{cx - 18},{cy - r * .4} {cx},{cy - r * .3} '
                   f'Q{cx + 18},{cy - r * .4} {cx},{cy - r * .5}Z" stroke-width="1.6"/>')
    out.append('</g>')
    return ''.join(out)


def stars(rng, n=40, ymax=420, color=GOLD_L):
    out = []
    for _ in range(n):
        x, y = rng.uniform(0, W), rng.uniform(0, ymax)
        s = rng.uniform(2, 6)
        o = rng.uniform(.3, .9)
        out.append(f'<path d="M{x},{y - s * 2} L{x + s * .4},{y - s * .4} L{x + s * 2},{y} L{x + s * .4},{y + s * .4} '
                   f'L{x},{y + s * 2} L{x - s * .4},{y + s * .4} L{x - s * 2},{y} L{x - s * .4},{y - s * .4}Z" fill="{color}" opacity="{o:.2f}"/>')
    return ''.join(out)


def string_lights(x1, y1, x2, y2, sag, n=18, colors=(GOLD_L, '#FF9F43', '#FFE29A')):
    cx, cy = (x1 + x2) / 2, max(y1, y2) + sag
    out = [f'<path d="M{x1},{y1} Q{cx},{cy} {x2},{y2}" stroke="#2A0A0E" stroke-width="2" fill="none" opacity="0.7"/>']
    for i in range(1, n):
        t = i / n
        x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2
        y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2
        c = colors[i % len(colors)]
        out.append(f'<circle cx="{x:.1f}" cy="{y + 6:.1f}" r="9" fill="{c}" opacity="0.55" filter="url(#glow)"/>'
                   f'<circle cx="{x:.1f}" cy="{y + 6:.1f}" r="4" fill="{c}"/>')
    return ''.join(out)


def durga(cx, cy, s=1.0, halo=True):
    """Stylised Durga face (matches the logo's flat-illustration look). Centred at (cx, cy)."""
    g = [f'<g transform="translate({cx} {cy}) scale({s})">']
    if halo:
        g.append('<circle r="230" fill="url(#haloG)" filter="url(#softglow)"/>')
        g.append(f'<circle r="168" fill="none" stroke="{GOLD}" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round"/>')
        for i in range(28):
            a = i * 360 / 28
            g.append(f'<path transform="rotate({a})" d="M0,-182 Q-12,-160 0,-148 Q12,-160 0,-182Z" fill="{GOLD}" opacity="0.9"/>')
    # hair
    g.append(f'<ellipse cx="0" cy="5" rx="118" ry="128" fill="{NAVY}"/>')
    # crown (mukut)
    g.append('<path d="M-118,-30 C-118,-120 -60,-160 0,-165 C60,-160 118,-120 118,-30 '
             'C80,-62 40,-74 0,-76 C-40,-74 -80,-62 -118,-30Z" fill="url(#goldV)" stroke="#9A5B0E" stroke-width="3"/>')
    g.append(f'<path d="M-20,-160 Q0,-235 20,-160Z" fill="url(#goldV)" stroke="#9A5B0E" stroke-width="3"/>'
             f'<path d="M-8,-170 Q0,-205 8,-170 Q0,-160 -8,-170Z" fill="{CRIMSON}"/>')
    for x in (-70, -35, 0, 35, 70):
        y = -112 + abs(x) * 0.5
        g.append(f'<path d="M{x - 9},{y} Q{x},{y - 26} {x + 9},{y} Q{x},{y + 10} {x - 9},{y}Z" fill="{CRIMSON}"/>')
    g.append(f'<path d="M-100,-62 C-60,-86 60,-86 100,-62" stroke="{CRIMSON}" stroke-width="5" fill="none"/>')
    # ear ornaments
    for sx in (-1, 1):
        g.append(f'<path d="M{sx * 92},-40 C{sx * 140},-30 {sx * 140},40 {sx * 96},50 C{sx * 112},20 {sx * 110},-10 {sx * 92},-40Z" fill="url(#goldV)"/>'
                 f'<path d="M{sx * 108},-6 Q{sx * 120},14 {sx * 104},30 Q{sx * 98},10 {sx * 108},-6Z" fill="{CRIMSON}"/>'
                 f'<circle cx="{sx * 84}" cy="66" r="13" fill="none" stroke="{GOLD}" stroke-width="6"/>')
    # face
    g.append('<path d="M-80,-40 C-82,40 -55,105 0,118 C55,105 82,40 80,-40 C60,-62 -60,-62 -80,-40Z" fill="url(#faceG)"/>')
    # brows
    for sx in (-1, 1):
        g.append(f'<path d="M{sx * 8},-8 C{sx * 30},-30 {sx * 60},-28 {sx * 78},-8" stroke="{NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    # eyes
    for sx in (-1, 1):
        g.append(f'<path d="M{sx * 10},14 C{sx * 30},-6 {sx * 58},-6 {sx * 82},6 C{sx * 58},28 {sx * 30},28 {sx * 10},14Z" '
                 f'fill="#FFF4E0" stroke="{NAVY}" stroke-width="5" stroke-linejoin="round"/>'
                 f'<circle cx="{sx * 42}" cy="12" r="11" fill="{NAVY}"/><circle cx="{sx * 39}" cy="9" r="3" fill="#fff"/>'
                 f'<path d="M{sx * 82},6 L{sx * 96},0" stroke="{NAVY}" stroke-width="5" stroke-linecap="round"/>')
    # third eye + bindi
    g.append(f'<path d="M0,-58 C10,-46 10,-32 0,-22 C-10,-32 -10,-46 0,-58Z" fill="#FFF4E0" stroke="{NAVY}" stroke-width="4"/>'
             f'<circle cx="0" cy="-40" r="5" fill="{NAVY}"/>'
             f'<path d="M-14,-18 Q0,-8 14,-18" stroke="{CRIMSON}" stroke-width="4" fill="none"/>'
             f'<circle cx="0" cy="-2" r="6" fill="{CRIMSON}"/>')
    # nose, nose-ring, lips
    g.append(f'<path d="M-4,20 C-6,44 -14,56 -10,62 Q0,68 10,62" stroke="#B5651D" stroke-width="4" fill="none" stroke-linecap="round"/>'
             f'<circle cx="22" cy="72" r="22" fill="none" stroke="{GOLD}" stroke-width="3"/><circle cx="40" cy="84" r="5" fill="{CRIMSON}"/>'
             f'<path d="M-22,86 Q-10,78 0,82 Q10,78 22,86 Q10,98 0,98 Q-10,98 -22,86Z" fill="#C81E2A"/>')
    # necklace
    g.append(f'<path d="M-70,112 Q0,170 70,112" stroke="{GOLD}" stroke-width="12" fill="none"/>')
    for i in range(9):
        t = i / 8
        x = -64 + 128 * t
        y = 116 + 46 * (1 - (2 * t - 1) ** 2)
        g.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{CRIMSON}"/>')
    g.append('</g>')
    return ''.join(g)


def crowd(rng, y=900, n=26, x0=-40, x1=W + 40, color=NIGHT, hmin=150, hmax=230, op=1):
    out = [f'<g fill="{color}" opacity="{op}">']
    xs = sorted(rng.uniform(x0, x1) for _ in range(n))
    for x in xs:
        h = rng.uniform(hmin, hmax)
        r = h * 0.11
        top = y - h
        out.append(f'<circle cx="{x:.0f}" cy="{top + r:.0f}" r="{r:.0f}"/>'
                   f'<path d="M{x - r * 2.6:.0f},{y} C{x - r * 2.6:.0f},{top + r * 3.2:.0f} {x - r * 1.4:.0f},{top + r * 2.3:.0f} {x:.0f},{top + r * 2.3:.0f} '
                   f'C{x + r * 1.4:.0f},{top + r * 2.3:.0f} {x + r * 2.6:.0f},{top + r * 3.2:.0f} {x + r * 2.6:.0f},{y}Z"/>')
        if rng.random() < .25:  # child on shoulders / balloon
            out.append(f'<line x1="{x + r * 2:.0f}" y1="{top + r * 2:.0f}" x2="{x + r * 3:.0f}" y2="{top - r * 4:.0f}" stroke="{color}" stroke-width="2"/>'
                       f'<ellipse cx="{x + r * 3:.0f}" cy="{top - r * 5:.0f}" rx="{r * .9:.0f}" ry="{r * 1.1:.0f}" fill="{rng.choice([CRIMSON, GOLD, "#E85D04"])}"/>')
    out.append('</g>')
    return ''.join(out)


def kash(x, y, h=220, flip=1, op=0.95):
    out = [f'<g opacity="{op}">']
    for k in range(5):
        dx = (k - 2) * 14 * flip
        bend = 40 * flip + k * 6
        tipx, tipy = x + dx + bend, y - h + k * 18
        out.append(f'<path d="M{x + dx},{y} Q{x + dx + bend * .2},{y - h * .5} {tipx},{tipy}" stroke="#C9B98F" stroke-width="3" fill="none"/>')
        for j in range(9):
            t = j / 9
            px = x + dx + (tipx - x - dx) * (0.55 + t * 0.45)
            py = y + (tipy - y) * (0.55 + t * 0.45)
            out.append(f'<ellipse cx="{px:.0f}" cy="{py:.0f}" rx="5" ry="22" fill="#FFFDF6" opacity="0.85" '
                       f'transform="rotate({(20 + j * 4) * flip} {px:.0f} {py:.0f})"/>')
    out.append('</g>')
    return ''.join(out)


def dhak(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s}) rotate(-18)">'
            f'<path d="M-70,-55 C-90,0 -90,0 -70,55 L70,55 C90,0 90,0 70,-55Z" fill="#B4441A" stroke="#5A1A08" stroke-width="4"/>'
            + ''.join(f'<path d="M{-70 + i * 20},-55 L{-50 + i * 20},55" stroke="{GOLD_L}" stroke-width="2" opacity="0.8"/>' for i in range(7))
            + f'<ellipse cx="-72" cy="0" rx="16" ry="55" fill="#F3E2BF" stroke="#5A1A08" stroke-width="4"/>'
              f'<ellipse cx="72" cy="0" rx="16" ry="55" fill="#F3E2BF" stroke="#5A1A08" stroke-width="4"/>'
              f'<ellipse cx="72" cy="0" rx="7" ry="22" fill="#6B2410"/>'
            + ''.join(f'<ellipse cx="{-30 + i * 14}" cy="{-90 - (i % 2) * 14}" rx="10" ry="38" fill="#FFFDF6" transform="rotate({-25 + i * 12} {-30 + i * 14} {-90 - (i % 2) * 14})"/>' for i in range(5))
            + '</g>')


def marigold(x, y, r=14):
    petals = ''.join(f'<ellipse cx="{x}" cy="{y - r * .6}" rx="{r * .45}" ry="{r * .7}" fill="#F59E0B" transform="rotate({a} {x} {y})"/>' for a in range(0, 360, 30))
    return petals + f'<circle cx="{x}" cy="{y}" r="{r * .45}" fill="#D97706"/>'


def garland(x1, y1, x2, y2, sag=60, n=16):
    cx, cy = (x1 + x2) / 2, max(y1, y2) + sag
    out = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2
        y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2
        out.append(marigold(round(x), round(y), 12 if i % 2 else 10))
    return ''.join(out)


def diya(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            f'<ellipse cx="0" cy="-26" rx="16" ry="26" fill="#FFB547" opacity="0.5" filter="url(#glow)"/>'
            f'<path d="M0,-40 C9,-26 7,-14 0,-10 C-7,-14 -9,-26 0,-40Z" fill="#FFD36B"/>'
            f'<path d="M-30,-8 Q0,-14 30,-8 Q22,14 0,14 Q-22,14 -30,-8Z" fill="#B4441A"/></g>')


def bunting(x1, y1, x2, y2, sag=40, n=16):
    cx, cy = (x1 + x2) / 2, max(y1, y2) + sag
    out = [f'<path d="M{x1},{y1} Q{cx},{cy} {x2},{y2}" stroke="#2A0A0E" stroke-width="2" fill="none"/>']
    cols = [CRIMSON, GOLD, '#E85D04', '#FFFDF6', GREEN]
    for i in range(n):
        t = (i + .5) / n
        x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2
        y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2
        out.append(f'<path d="M{x - 16:.0f},{y:.0f} L{x + 16:.0f},{y:.0f} L{x:.0f},{y + 34:.0f}Z" fill="{cols[i % len(cols)]}"/>')
    return ''.join(out)


def arch_path(l, r, g, t, h):
    c = (l + r) / 2
    return (f'M{l},{g} L{l},{t} C{l},{t - h * .55} {c - (r - l) * .18},{t - h * .75} {c},{t - h} '
            f'C{c + (r - l) * .18},{t - h * .75} {r},{t - h * .55} {r},{t} L{r},{g}Z')


def sanctum(cx, g, w, t, h, face_s=0.62, face_y=None):
    """A glowing arched opening with the Durga face inside."""
    l, r = cx - w / 2, cx + w / 2
    p = arch_path(l, r, g, t, h)
    clip = f'clip{int(cx)}{int(t)}'
    fy = face_y if face_y is not None else (t + g) / 2 - 20
    return (f'<clipPath id="{clip}"><path d="{p}"/></clipPath>'
            f'<path d="{p}" fill="url(#sanctum)"/>'
            f'<g clip-path="url(#{clip})">{durga(cx, fy, face_s)}</g>'
            f'<path d="{p}" fill="none" stroke="url(#goldV)" stroke-width="10"/>')


def lit_outline(points, color=GOLD_L, step=26):
    """Fairy-light dots along a polyline."""
    out = []
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        d = math.hypot(x2 - x1, y2 - y1)
        for i in range(int(d // step) + 1):
            t = i * step / d if d else 0
            x, y = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
            out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="7" fill="{color}" opacity="0.45" filter="url(#glow)"/>'
                       f'<circle cx="{x:.0f}" cy="{y:.0f}" r="3" fill="{color}"/>')
    return ''.join(out)


def vignette():
    return (f'<rect y="{H * .62:.0f}" width="{W}" height="{H * .38:.0f}" fill="url(#ground)"/>'
            f'<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/>'
            f'<stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient><rect width="{W}" height="{H}" fill="url(#vig)"/>')


def night_base(rng, top='#14010A', mid=MAROON, bottom=DEEP):
    sd, sb = sky(top, mid, bottom)
    return sd, sb + stars(rng) + mandala(140, 140, 220, op=.12) + mandala(W - 140, 140, 220, op=.12)


# ---------------------------------------------------------------- structures

def theme_pandal(cx=800, g=760, body='url(#crimsonV)', trim='url(#goldV)', extra=''):
    tiers = [(620, 470), (480, 330), (330, 200)]
    out = [f'<ellipse cx="{cx}" cy="420" rx="520" ry="380" fill="#FF8A3D" opacity="0.18" filter="url(#haze)"/>']
    for w, t in tiers:
        out.append(f'<rect x="{cx - w / 2}" y="{t}" width="{w}" height="{g - t}" fill="{body}" stroke="#2A0208" stroke-width="3"/>'
                   f'<rect x="{cx - w / 2 - 14}" y="{t - 18}" width="{w + 28}" height="22" rx="4" fill="{trim}"/>')
        out.append(lit_outline([(cx - w / 2 - 10, t - 24), (cx + w / 2 + 10, t - 24)]))
    out.append(f'<path d="M{cx - 70},182 Q{cx},20 {cx + 70},182Z" fill="{trim}"/><circle cx="{cx}" cy="70" r="14" fill="{CRIMSON}"/>')
    for sx in (-1, 1):
        for i in range(3):
            x = cx + sx * (130 + i * 70)
            out.append(f'<path d="{arch_path(x - 24, x + 24, g - 40, 560 - i * 10, 50)}" fill="#2A0208" stroke="{GOLD}" stroke-width="4" opacity="0.9"/>')
    out.append(extra)
    out.append(sanctum(cx, g, 280, 470, 140, 0.6))
    out.append(lit_outline([(cx - 320, g), (cx - 320, 470)]) + lit_outline([(cx + 320, g), (cx + 320, 470)]))
    return ''.join(out)


def chala_temple(cx=800, g=760, w=700, wall='#B5532A', roof='#8E3A1C', tiles=True):
    l, r = cx - w / 2, cx + w / 2
    top = 420
    pat = ''
    if tiles:
        pat = ('<pattern id="terra" width="46" height="46" patternUnits="userSpaceOnUse">'
               '<rect width="46" height="46" fill="#B5532A"/><rect x="3" y="3" width="40" height="40" rx="4" fill="#C4683A"/>'
               '<circle cx="23" cy="23" r="10" fill="none" stroke="#8E3A1C" stroke-width="3"/>'
               '<path d="M23,13 L26,20 L33,23 L26,26 L23,33 L20,26 L13,23 L20,20Z" fill="#8E3A1C"/></pattern>')
    fill = 'url(#terra)' if tiles else wall
    out = [pat, f'<ellipse cx="{cx}" cy="460" rx="560" ry="340" fill="#FF8A3D" opacity="0.2" filter="url(#haze)"/>',
           f'<rect x="{l}" y="{top}" width="{w}" height="{g - top}" fill="{fill}" stroke="#5A1A08" stroke-width="4"/>',
           # curved do-chala roof
           f'<path d="M{l - 60},{top + 20} Q{cx},{top - 90} {r + 60},{top + 20} L{r + 20},{top - 40} Q{cx},{top - 230} {l - 20},{top - 40}Z" fill="{roof}" stroke="#5A1A08" stroke-width="4"/>',
           f'<path d="M{l - 60},{top + 20} Q{cx},{top - 90} {r + 60},{top + 20}" stroke="{GOLD}" stroke-width="6" fill="none"/>',
           lit_outline([(l - 50, top + 30), (l + w * .25, top - 30), (cx, top - 45), (r - w * .25, top - 30), (r + 50, top + 30)]),
           f'<path d="M{cx - 30},{top - 160} Q{cx},{top - 260} {cx + 30},{top - 160}Z" fill="url(#goldV)"/>']
    # triple arched entrance with pillars
    for i, x in enumerate((cx - 220, cx + 220)):
        out.append(f'<path d="{arch_path(x - 70, x + 70, g, 560, 70)}" fill="#3A0A04" stroke="url(#goldV)" stroke-width="6"/>'
                   f'<path d="{arch_path(x - 70, x + 70, g, 560, 70)}" fill="url(#sanctum)" opacity="0.5"/>')
    for x in (cx - 310, cx - 130, cx + 130, cx + 310):
        out.append(f'<rect x="{x - 14}" y="{top + 30}" width="28" height="{g - top - 30}" fill="#8E3A1C" stroke="#5A1A08" stroke-width="3"/>')
    out.append(sanctum(cx, g, 220, 540, 110, 0.5))
    return ''.join(out)


def rajbari(cx=800, g=760, w=1100):
    l, r = cx - w / 2, cx + w / 2
    top = 360
    out = [f'<ellipse cx="{cx}" cy="460" rx="600" ry="320" fill="#FFB547" opacity="0.2" filter="url(#haze)"/>',
           f'<rect x="{l}" y="{top}" width="{w}" height="{g - top}" fill="#EFE3CC" stroke="#8A7558" stroke-width="3"/>',
           f'<rect x="{l - 20}" y="{top - 40}" width="{w + 40}" height="44" fill="#F7EEDC" stroke="#8A7558" stroke-width="3"/>']
    for i in range(int(w // 34)):  # balustrade
        x = l + 10 + i * 34
        out.append(f'<rect x="{x}" y="{top - 34}" width="14" height="30" rx="6" fill="#D9C9A8"/>')
    n = 7
    span = w / n
    for i in range(n):
        x0 = l + i * span
        if i != n // 2:
            out.append(f'<path d="{arch_path(x0 + 26, x0 + span - 26, g, 520, 90)}" fill="#3A2416" opacity="0.85"/>'
                       f'<path d="{arch_path(x0 + 26, x0 + span - 26, g, 520, 90)}" fill="url(#sanctum)" opacity="0.35"/>')
        out.append(f'<rect x="{x0 - 12}" y="{top + 10}" width="24" height="{g - top - 10}" fill="#FBF6EA" stroke="#A8936E" stroke-width="2"/>'
                   f'<rect x="{x0 - 20}" y="{top + 4}" width="40" height="16" fill="#D9C9A8"/>')
    out.append(f'<path d="M{l + 40},{top + 6} Q{cx},{top + 70} {r - 40},{top + 6}" stroke="{CRIMSON}" stroke-width="4" fill="none"/>')
    out.append(garland(l + 60, top + 24, r - 60, top + 24, 50, 30))
    out.append(sanctum(cx, g, span - 30, 500, 100, 0.55))
    return ''.join(out)


def cloth_pandal(cx=800, g=760, w=820):
    l, r = cx - w / 2, cx + w / 2
    top = 380
    stripes = ('<pattern id="stripe" width="60" height="10" patternUnits="userSpaceOnUse">'
               f'<rect width="30" height="10" fill="{CRIMSON}"/><rect x="30" width="30" height="10" fill="#E8A13A"/></pattern>')
    out = [stripes, f'<ellipse cx="{cx}" cy="480" rx="560" ry="320" fill="#FF8A3D" opacity="0.22" filter="url(#haze)"/>',
           f'<path d="M{l},{g} L{l},{top} L{cx},{top - 170} L{r},{top} L{r},{g}Z" fill="url(#stripe)" stroke="#4A0A10" stroke-width="4"/>',
           f'<path d="M{l - 20},{top + 10} L{cx},{top - 180} L{r + 20},{top + 10}" stroke="url(#goldV)" stroke-width="14" fill="none" stroke-linejoin="round"/>']
    # scalloped valance
    for i in range(int(w // 50)):
        x = l + i * 50
        out.append(f'<path d="M{x},{top} Q{x + 25},{top + 40} {x + 50},{top}Z" fill="{GOLD}" stroke="#9A5B0E" stroke-width="2"/>')
    out.append(lit_outline([(l - 10, top + 10), (cx, top - 175), (r + 10, top + 10)]))
    out.append(sanctum(cx, g, 380, 520, 90, 0.62))
    return ''.join(out)


def bamboo_pandal(cx=800, g=760):
    out = [f'<ellipse cx="{cx}" cy="480" rx="600" ry="340" fill="#C6E39A" opacity="0.18" filter="url(#haze)"/>']
    for k in range(4):  # layered woven arches
        w = 760 - k * 110
        t = 330 + k * 40
        p = arch_path(cx - w / 2, cx + w / 2, g, t, 170 - k * 20)
        out.append(f'<path d="{p}" fill="none" stroke="{["#C49A5A", "#A97C3C", "#D7B274", "#8E6430"][k]}" stroke-width="{34 - k * 4}"/>')
        for j in range(0, 12):
            out.append(f'<path d="{p}" fill="none" stroke="#6B4A22" stroke-width="1.5" stroke-dasharray="3 {40 + j}" opacity="0.6"/>')
    # leaves
    rng = random.Random(7)
    for _ in range(70):
        a = rng.uniform(math.pi * 1.05, math.pi * 1.95)
        rad = rng.uniform(330, 420)
        x, y = cx + math.cos(a) * rad, 560 + math.sin(a) * rad * .85
        out.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="9" ry="26" fill="{rng.choice([GREEN, "#2F6B33", "#5FA052"])}" '
                   f'transform="rotate({rng.uniform(0, 180):.0f} {x:.0f} {y:.0f})"/>')
    out.append(sanctum(cx, g, 300, 520, 110, 0.55))
    return ''.join(out)


# ---------------------------------------------------------------- scenes

def scene_pandal(structure, seed, sky_cols=('#14010A', MAROON, DEEP), extra_bg='', extra_fg='', crowd_n=22):
    rng = random.Random(seed)
    sd, sb = sky(*sky_cols)
    body = sb + stars(rng) + mandala(140, 140, 220, op=.12) + mandala(W - 140, 140, 220, op=.12) + extra_bg
    body += string_lights(-20, 90, 620, 120, 120) + string_lights(980, 120, W + 20, 90, 120)
    body += structure
    body += vignette()
    body += crowd(rng, n=crowd_n, hmin=140, hmax=220, op=.92)
    body += extra_fg
    return svg(body, sd)


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(content)
    print(f'  {path}  ({len(content) // 1024} KB)')


def perspective_street(rng, vx=800, vy=430, road='#2A0A0E'):
    out = [f'<path d="M{vx - 40},{vy} L{vx + 40},{vy} L{W + 300},{H} L-300,{H}Z" fill="{road}"/>']
    # buildings left & right
    for side in (-1, 1):
        for i in range(6):
            t0, t1 = i / 6, (i + 1) / 6
            x0 = vx + side * (60 + (W * .62) * t0 ** 1.4)
            x1 = vx + side * (60 + (W * .62) * t1 ** 1.4)
            h0, h1 = 120 + 520 * t0 ** 1.3, 120 + 520 * t1 ** 1.3
            col = rng.choice(['#4A0C14', '#3A0A10', '#5A1420', '#2E060C'])
            out.append(f'<path d="M{x0:.0f},{vy + 30 * t0:.0f} L{x0:.0f},{vy - h0:.0f} L{x1:.0f},{vy - h1:.0f} L{x1:.0f},{vy + 260 * t1:.0f}Z" fill="{col}"/>')
            for k in range(3):  # lit windows
                wx = x0 + (x1 - x0) * (.25 + k * .25)
                wy = vy - (h0 + h1) / 2 * .55
                out.append(f'<rect x="{wx - 8:.0f}" y="{wy:.0f}" width="16" height="{20 + 40 * t1:.0f}" fill="{GOLD_L}" opacity="{rng.uniform(.35, .8):.2f}"/>')
    return ''.join(out)


def scooter(x, y, s=1.0, flip=1):
    return (f'<g transform="translate({x} {y}) scale({s * flip} {s})" fill="#12000A" stroke="{GOLD}" stroke-width="2.5" stroke-opacity="0.8">'
            f'<circle cx="-50" cy="0" r="22"/><circle cx="55" cy="0" r="22"/>'
            f'<path d="M-70,-10 L-20,-40 L40,-40 L70,-10 L60,0 L-60,0Z"/>'
            f'<path d="M40,-40 L55,-90 L70,-90" stroke="{NIGHT}" stroke-width="8" fill="none"/>'
            f'<circle cx="0" cy="-140" r="20"/><path d="M-30,-40 C-30,-110 -10,-120 0,-120 C20,-120 30,-100 30,-40Z"/>'
            f'<circle cx="72" cy="-60" r="10" fill="#FFE29A"/><circle cx="72" cy="-60" r="26" fill="#FFE29A" opacity="0.35" filter="url(#glow)"/>'
            f'<circle cx="-72" cy="-14" r="7" fill="#FF3B3B"/></g>')


def auto_rickshaw(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            f'<path d="M-120,0 L-120,-130 Q-110,-170 -40,-175 L60,-175 Q110,-170 120,-120 L130,0Z" fill="#2E7D32" stroke="#14381A" stroke-width="5"/>'
            f'<path d="M-120,-60 L130,-60 L130,0 L-120,0Z" fill="#F2C230"/>'
            f'<path d="M-90,-150 L20,-150 L20,-75 L-90,-75Z" fill="#14381A" opacity="0.7"/>'
            f'<circle cx="-80" cy="5" r="28" fill="#111"/><circle cx="90" cy="5" r="28" fill="#111"/>'
            f'<circle cx="-80" cy="5" r="10" fill="#666"/><circle cx="90" cy="5" r="10" fill="#666"/>'
            f'<circle cx="125" cy="-90" r="10" fill="#FFE29A"/></g>')


def gate(cx, g, w, h):
    return (f'<path d="{arch_path(cx - w / 2, cx + w / 2, g, g - h, h * .35)}" fill="none" stroke="url(#goldV)" stroke-width="16"/>'
            + lit_outline([(cx - w / 2, g), (cx - w / 2, g - h), (cx, g - h * 1.35), (cx + w / 2, g - h), (cx + w / 2, g)]))


def family(rng, x, g=900):
    out = [f'<g fill="#12000A" stroke="{GOLD_L}" stroke-width="2.5" stroke-opacity="0.75">']
    for dx, h in ((0, 230), (70, 215), (130, 120), (175, 100), (-80, 200)):
        r = h * .11
        top = g - h
        out.append(f'<circle cx="{x + dx}" cy="{top + r:.0f}" r="{r:.0f}"/>'
                   f'<path d="M{x + dx - r * 2.4:.0f},{g} C{x + dx - r * 2.4:.0f},{top + r * 3:.0f} {x + dx - r * 1.2:.0f},{top + r * 2.3:.0f} {x + dx},{top + r * 2.3:.0f} '
                   f'C{x + dx + r * 1.2:.0f},{top + r * 2.3:.0f} {x + dx + r * 2.4:.0f},{top + r * 3:.0f} {x + dx + r * 2.4:.0f},{g}Z"/>')
    out.append(f'<path d="M{x - 112},{g - 140} L{x - 125},{g}" stroke="{NIGHT}" stroke-width="5"/></g>')  # walking stick
    return ''.join(out)


def build():
    print('Generating illustrations →', os.path.relpath(ROOT))

    # ---- pandal categories
    write('pandals/category-theme.svg', scene_pandal(theme_pandal(), 1))
    write('pandals/category-heritage.svg', scene_pandal(rajbari(), 2, ('#1A0510', '#4A0E16', '#7A1E18')))
    write('pandals/category-traditional.svg', scene_pandal(
        f'<ellipse cx="800" cy="450" rx="600" ry="380" fill="#FFB547" opacity="0.25" filter="url(#haze)"/>'
        f'<path d="M180,140 L1420,140 L1380,220 L220,220Z" fill="{CRIMSON}"/>'
        + ''.join(f'<path d="M{200 + i * 60},220 Q{230 + i * 60},260 {260 + i * 60},220Z" fill="#FFFDF6"/>' for i in range(20))
        + f'<path d="{arch_path(420, 1180, 790, 400, 200)}" fill="#F3E9D6" stroke="#C9B78F" stroke-width="6"/>'
        + f'<path d="{arch_path(450, 1150, 790, 420, 180)}" fill="url(#sanctum)"/>'
        + ''.join(f'<circle cx="{800 + math.cos(math.radians(a)) * 330:.0f}" cy="{430 + math.sin(math.radians(a)) * 190:.0f}" r="10" fill="#FFFDF6"/>' for a in range(185, 356, 10))
        + durga(800, 520, .78)
        + dhak(300, 640, 1.1) + dhak(1300, 640, 1.1)
        + diya(560, 800) + diya(1040, 800), 3, ('#1A0208', '#4A0610', '#6C020E'), crowd_n=10))
    write('pandals/category-community.svg', scene_pandal(
        cloth_pandal() + bunting(80, 260, 760, 300, 60) + bunting(840, 300, 1520, 260, 60)
        + ''.join(f'<g><rect x="{x}" y="640" width="150" height="110" fill="#3A0A10"/><path d="M{x - 10},640 L{x + 160},640 L{x + 150},610 L{x},610Z" fill="{c}"/>'
                  f'<circle cx="{x + 75}" cy="600" r="8" fill="#FFE29A"/><circle cx="{x + 75}" cy="600" r="24" fill="#FFE29A" opacity="0.4" filter="url(#glow)"/></g>'
                  for x, c in ((60, CRIMSON), (1390, GOLD))),
        4, ('#2A0A28', '#5A1430', '#9A2A1A')))
    write('pandals/category-eco-friendly.svg', scene_pandal(
        bamboo_pandal() + kash(230, 860, 300) + kash(1380, 860, 300, -1), 5, ('#0F1A10', '#2A2A14', '#5A2A10'), crowd_n=12))

    # ---- featured pandals
    rings = ''.join(f'<ellipse cx="800" cy="440" rx="{rx}" ry="{rx * .32:.0f}" fill="none" stroke="{GOLD}" stroke-width="5" opacity="0.75" transform="rotate({rot} 800 440)"/>'
                    for rx, rot in ((640, -12), (520, 10), (420, -24)))
    planets = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/><circle cx="{x}" cy="{y}" r="{r + 16}" fill="{c}" opacity="0.3" filter="url(#glow)"/>'
                      for x, y, r, c in ((210, 300, 34, '#5BA4E6'), (1380, 250, 44, GOLD), (1230, 520, 22, '#E85D04'), (360, 560, 18, GOLD_L)))
    write('pandals/cosmic.svg', scene_pandal(
        theme_pandal(body='#16124A', extra='') + rings + planets, 6, ('#05061C', '#16124A', '#3A0A3A')))
    write('pandals/traditional.svg', scene_pandal(
        rajbari(w=1000) + dhak(260, 700, 1.2) + dhak(1340, 700, 1.2) + diya(640, 790) + diya(960, 790), 7,
        ('#1A0510', '#4A0E16', '#7A1E18'), crowd_n=12))
    write('pandals/terracotta.svg', scene_pandal(chala_temple(), 8, ('#1A0608', '#4A1410', '#8A3418')))
    write('pandals/bamboo.svg', scene_pandal(
        '<path d="M0,520 L180,330 L300,420 L470,250 L640,400 L800,280 L980,410 L1150,260 L1320,390 L1460,300 L1600,420 L1600,620 L0,620Z" fill="#20301E" opacity="0.8"/>'
        + bamboo_pandal() + kash(150, 860, 280) + kash(1450, 860, 280, -1), 9, ('#0A1612', '#1E3A2A', '#4A3A18'), crowd_n=12))
    plates = ('<radialGradient id="kansa" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFF1C1"/>'
              '<stop offset="0.5" stop-color="#E8AE45"/><stop offset="1" stop-color="#8A5A12"/></radialGradient>'
              + ''.join(f'<circle cx="{x}" cy="{y}" r="30" fill="url(#kansa)" stroke="#6B4410" stroke-width="2"/><circle cx="{x}" cy="{y}" r="14" fill="none" stroke="#6B4410" stroke-width="2" opacity="0.6"/>'
                        for y in range(500, 760, 70) for x in list(range(530, 680, 70)) + list(range(940, 1100, 70))))
    write('pandals/bellmetal.svg', scene_pandal(theme_pandal(body='#4A1A08', extra=plates), 10, ('#160804', '#3E1608', '#7A3410')))

    # ---- routes
    rng = random.Random(21)
    sd, sb = sky('#14010A', '#4A0610', '#8A2A10')
    body = sb + stars(rng, 30, 300) + perspective_street(rng)
    body += f'<path d="{arch_path(740, 860, 440, 360, 50)}" fill="url(#sanctum)"/>{durga(800, 400, .18, halo=False)}'
    for i in range(5):
        y = 150 + i * 60
        body += string_lights(-20, y, W + 20, y, 40 + i * 15, 26)
    body += vignette() + crowd(rng, n=18, x0=250, x1=1350, hmin=150, hmax=240)
    write('routes/central-siliguri-heritage-walk.svg', svg(body, sd))

    rng = random.Random(22)
    sd, sb = sky('#0E0210', '#3A0A20', '#8A2A14')
    body = sb + stars(rng, 30, 280)
    body += '<path d="M0,430 L200,330 L380,400 L560,300 L760,390 L980,290 L1180,380 L1400,310 L1600,400 L1600,460 L0,460Z" fill="#2A0A18"/>'
    body += perspective_street(rng, road='#1E060C')
    for i, c in enumerate(('#FF3B3B', '#FFE29A', '#FF9F43', '#FFE29A')):
        sx = 700 + i * 60
        body += f'<path d="M{sx - 20},440 Q{sx - 40 + i * 30},650 {120 + i * 420},{H}" stroke="{c}" stroke-width="{4 + i * 2}" fill="none" opacity="0.7" filter="url(#glow)"/>'
    body += gate(800, 470, 260, 140) + gate(800, 620, 620, 260)
    body += vignette() + scooter(520, 840, 1.1) + scooter(1080, 800, .9, -1) + scooter(820, 870, 1.25)
    write('routes/eastern-corridor-grand-themes.svg', svg(body, sd))

    rng = random.Random(23)
    sd, sb = sky('#2A0A28', '#7A1E30', '#D06A2A')
    body = sb + stars(rng, 20, 220) + mandala(W - 160, 150, 200, op=.14)
    body += f'<path d="M0,620 L1600,620 L1600,900 L0,900Z" fill="#3A1216"/><path d="M0,700 L1600,700" stroke="{GOLD_L}" stroke-width="4" stroke-dasharray="40 30" opacity="0.5"/>'
    body += cloth_pandal(cx=1150, g=640, w=520).replace('url(#stripe)', CRIMSON)
    body += gate(1150, 650, 640, 300)
    body += vignette() + auto_rickshaw(420, 800, 1.3) + family(rng, 880)
    write('routes/north-junction-family-express.svg', svg(body, sd))

    # ---- guides
    rng = random.Random(31)
    sd, sb = sky('#14010A', MAROON, DEEP)
    body = sb + stars(rng) + mandala(800, 120, 260, op=.12)
    body += f'<g transform="translate(-250 140) scale(.62)">{theme_pandal()}</g>'
    body += f'<g transform="translate(310 110) scale(.62)">{chala_temple()}</g>'
    body += f'<g transform="translate(860 140) scale(.62)">{cloth_pandal()}</g>'
    body += string_lights(-20, 80, W + 20, 80, 90, 34) + vignette() + crowd(rng, n=26, hmin=120, hmax=190)
    write('guides/best-durga-puja-pandals-in-siliguri.svg', svg(body.replace('id="terra"', 'id="terra"'), sd))

    rng = random.Random(32)
    sd, sb = sky('#10020C', '#3A0A18', '#7A2014')
    body = sb + stars(rng, 40, 320)
    body += '<path d="M0,900 L700,520 L900,520 L1600,900Z" fill="#20060C"/>'
    for k in (-1, 1):
        body += f'<path d="M{800 + k * 60},520 L{800 + k * 520},{H}" stroke="#9A8A7A" stroke-width="8"/>'
    for i in range(14):
        t = (i / 14) ** 1.6
        y = 520 + (H - 520) * t
        half = 70 + 470 * t
        body += f'<rect x="{800 - half:.0f}" y="{y:.0f}" width="{half * 2:.0f}" height="{4 + 14 * t:.0f}" fill="#4A2A1A"/>'
    body += '<rect x="80" y="380" width="380" height="180" fill="#5A1420"/><path d="M60,380 L480,380 L440,330 L100,330Z" fill="#3A0A10"/>'
    body += ''.join(f'<rect x="{110 + i * 90}" y="420" width="50" height="70" fill="{GOLD_L}" opacity="0.7"/>' for i in range(4))
    body += f'<g transform="translate(680 60) scale(.62)">{cloth_pandal()}</g>'
    body += bunting(0, 160, 700, 200, 60) + string_lights(900, 140, W + 20, 120, 100)
    body += vignette() + crowd(rng, n=12, x0=1000, x1=1600, hmin=150, hmax=220)
    write('guides/central-colony-durga-puja-2026.svg', svg(body, sd))

    # Mahalaya river dawn
    def river_dawn(seed, people=True, radio=True):
        rng = random.Random(seed)
        sd, sb = sky('#2A0A30', '#B4405A', '#F7B267', 'dawn')
        body = sb + stars(rng, 18, 200, '#FFF4E0')
        body += f'<circle cx="800" cy="560" r="300" fill="url(#haloG)" filter="url(#softglow)" opacity="0.8"/>'
        body += f'<circle cx="800" cy="560" r="110" fill="#FFE29A"/>'
        body += '<path d="M0,520 L260,470 L520,505 L760,460 L1040,500 L1300,465 L1600,510 L1600,560 L0,560Z" fill="#5A1A3A" opacity="0.6"/>'
        body += f'<rect y="560" width="{W}" height="340" fill="#7A2A4A"/>'
        body += ''.join(f'<rect x="{800 - w / 2:.0f}" y="{570 + i * 18}" width="{w:.0f}" height="6" rx="3" fill="#FFD27A" opacity="{.7 - i * .04:.2f}"/>'
                        for i, w in enumerate([220 - i * 8 + rng.uniform(-30, 30) for i in range(16)]))
        body += f'<rect y="560" width="{W}" height="340" fill="#2A0A20" opacity="0.25"/>'
        body += f'<ellipse cx="800" cy="560" rx="900" ry="40" fill="#FFF4E0" opacity="0.25" filter="url(#glow)"/>'
        if people:
            for x, h in ((470, 170), (600, 150), (1050, 165), (1180, 140)):
                r = h * .12
                body += (f'<g fill="#2A0A1E"><circle cx="{x}" cy="{720 - h + r:.0f}" r="{r:.0f}"/>'
                         f'<path d="M{x - r * 2.2:.0f},720 C{x - r * 2.2:.0f},{720 - h + r * 3:.0f} {x - r},{720 - h + r * 2.2:.0f} {x},{720 - h + r * 2.2:.0f} '
                         f'C{x + r},{720 - h + r * 2.2:.0f} {x + r * 2.2:.0f},{720 - h + r * 3:.0f} {x + r * 2.2:.0f},720Z"/>'
                         f'<path d="M{x - r * 2},{720 - h * .55:.0f} L{x - r * .5:.0f},{720 - h * .85:.0f} L{x + r * .5:.0f},{720 - h * .85:.0f} L{x + r * 2},{720 - h * .55:.0f}" stroke="#2A0A1E" stroke-width="10" fill="none"/></g>'
                         f'<ellipse cx="{x}" cy="722" rx="{r * 3.4:.0f}" ry="8" fill="#FFD27A" opacity="0.35"/>')
        body += f'<path d="M0,820 Q400,760 800,830 T1600,800 L1600,900 L0,900Z" fill="#2A0A1E"/>'
        body += kash(120, 900, 330) + kash(260, 900, 260) + kash(1480, 900, 330, -1) + kash(1340, 900, 250, -1)
        if radio:
            body += ('<g transform="translate(1180 790)"><rect x="-80" y="-60" width="160" height="96" rx="12" fill="#6B3A1A" stroke="#2A0A0E" stroke-width="4"/>'
                     '<circle cx="-34" cy="-12" r="30" fill="#2A140A"/>'
                     + ''.join(f'<circle cx="-34" cy="-12" r="{r}" fill="none" stroke="#8A5A2A" stroke-width="2"/>' for r in (10, 18, 26))
                     + f'<rect x="10" y="-40" width="56" height="20" rx="3" fill="{GOLD_L}"/><circle cx="24" cy="10" r="8" fill="{GOLD}"/><circle cx="52" cy="10" r="8" fill="{GOLD}"/>'
                     '<path d="M40,-60 L70,-120" stroke="#2A0A0E" stroke-width="4"/></g>')
        return svg(body, sd)

    write('guides/mahalaya-siliguri-traditions.svg', river_dawn(33))

    # flat-lay planning
    rng = random.Random(34)
    body = f'<rect width="{W}" height="{H}" fill="#6B3A1E"/>'
    body += ''.join(f'<rect x="0" y="{i * 75}" width="{W}" height="73" fill="{rng.choice(["#7A4422", "#6B3A1E", "#8A5028"])}"/>' for i in range(12))
    body += mandala(800, 450, 500, GOLD_L, .08)
    body += ('<g transform="rotate(-6 760 440)"><rect x="300" y="140" width="920" height="600" rx="10" fill="#F7EEDC"/>'
             '<path d="M300,520 Q600,460 760,540 T1220,500" stroke="#9CC3E6" stroke-width="40" fill="none" opacity="0.8"/>')
    for i in range(10):
        body += f'<path d="M{300 + i * 95},140 L{340 + i * 85},740" stroke="#D9C9A8" stroke-width="{rng.choice([4, 8])}"/>'
    for i in range(6):
        body += f'<path d="M300,{180 + i * 100} L1220,{200 + i * 95}" stroke="#D9C9A8" stroke-width="{rng.choice([4, 8])}"/>'
    pts = [(420, 640), (540, 420), (720, 470), (860, 300), (1060, 380)]
    body += f'<path d="M{" L".join(f"{x},{y}" for x, y in pts)}" stroke="{CRIMSON}" stroke-width="12" fill="none" stroke-dasharray="26 14" stroke-linecap="round"/>'
    for x, y in pts:
        body += f'<path d="M{x},{y} C{x - 26},{y - 34} {x - 22},{y - 64} {x},{y - 64} C{x + 22},{y - 64} {x + 26},{y - 34} {x},{y}Z" fill="{CRIMSON}" stroke="#fff" stroke-width="4"/><circle cx="{x}" cy="{y - 42}" r="9" fill="{GOLD_L}"/>'
    body += '</g>'
    body += ('<g transform="rotate(12 1360 300)"><rect x="1270" y="120" width="190" height="370" rx="28" fill="#1A1A1A"/>'
             f'<rect x="1284" y="146" width="162" height="318" rx="10" fill="{CRIMSON}"/>'
             f'<circle cx="1365" cy="250" r="44" fill="{GOLD}"/><rect x="1300" y="330" width="130" height="16" rx="8" fill="{GOLD_L}"/>'
             f'<rect x="1300" y="360" width="100" height="12" rx="6" fill="{GOLD_L}" opacity="0.6"/><rect x="1300" y="400" width="130" height="40" rx="12" fill="{GOLD_L}"/></g>')
    body += ('<circle cx="190" cy="700" r="110" fill="#F3E9D6"/><circle cx="190" cy="700" r="84" fill="#A0522D"/><circle cx="190" cy="700" r="70" fill="#C47A3A"/>'
             '<path d="M290,690 Q350,700 300,740" stroke="#F3E9D6" stroke-width="18" fill="none"/>')
    for x, y in ((140, 180), (210, 250), (120, 300), (1450, 720), (1520, 640), (1390, 800)):
        body += marigold(x, y, 34)
    body += dhak(1180, 790, .7)
    write('guides/siliguri-pandal-hopping-guide.svg', svg(body, ''))

    # illustrated map
    rng = random.Random(35)
    body = f'<rect width="{W}" height="{H}" fill="#2A0610"/>' + mandala(800, 450, 520, GOLD, .08)
    body += '<path d="M-40,180 C300,260 420,120 700,300 S1100,640 1700,560" stroke="#3B6E9E" stroke-width="56" fill="none" opacity="0.75"/>'
    for i in range(9):
        y = 60 + i * 100 + rng.uniform(-20, 20)
        body += f'<path d="M0,{y:.0f} Q800,{y + rng.uniform(-60, 60):.0f} {W},{y + rng.uniform(-30, 30):.0f}" stroke="#4A1220" stroke-width="{rng.choice([4, 8])}" fill="none"/>'
    for i in range(14):
        x = 40 + i * 120 + rng.uniform(-20, 20)
        body += f'<path d="M{x:.0f},0 Q{x + rng.uniform(-60, 60):.0f},450 {x + rng.uniform(-40, 40):.0f},{H}" stroke="#4A1220" stroke-width="{rng.choice([4, 8])}" fill="none"/>'
    body += '<path d="M120,820 C380,640 520,700 700,520 S1040,380 1480,140" stroke="#7A2430" stroke-width="22" fill="none"/>'
    route = [(240, 720), (480, 640), (700, 520), (930, 470), (1160, 330), (1400, 200)]
    body += f'<path d="M{" L".join(f"{x},{y}" for x, y in route)}" stroke="{GOLD}" stroke-width="10" fill="none" stroke-dasharray="22 14" stroke-linecap="round" filter="url(#glow)"/>'
    body += f'<path d="M{" L".join(f"{x},{y}" for x, y in route)}" stroke="{GOLD_L}" stroke-width="6" fill="none" stroke-dasharray="22 14" stroke-linecap="round"/>'
    for i in range(26):
        x, y = rng.uniform(80, W - 80), rng.uniform(80, H - 80)
        body += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="18" fill="{GOLD}" opacity="0.25" filter="url(#glow)"/><circle cx="{x:.0f}" cy="{y:.0f}" r="6" fill="{GOLD_L}"/>'
    for x, y in route:
        body += (f'<circle cx="{x}" cy="{y - 40}" r="46" fill="{GOLD}" opacity="0.35" filter="url(#glow)"/>'
                 f'<path d="M{x},{y} C{x - 34},{y - 42} {x - 30},{y - 84} {x},{y - 84} C{x + 30},{y - 84} {x + 34},{y - 42} {x},{y}Z" fill="{CRIMSON}" stroke="{GOLD_L}" stroke-width="5"/>'
                 f'<path d="M{x - 14},{y - 46} L{x},{y - 66} L{x + 14},{y - 46}Z" fill="{GOLD_L}"/>')
    body += f'<rect width="{W}" height="{H}" fill="none" stroke="{GOLD}" stroke-width="10" opacity="0.5"/>'
    write('guides/siliguri-puja-map-guide.svg', svg(body, ''))

    # ---- mahalaya background (soft, sits behind countdown at low opacity)
    write('mahalaya/mahalaya-dawn.svg', river_dawn(41, people=False, radio=False))


if __name__ == '__main__':
    build()
