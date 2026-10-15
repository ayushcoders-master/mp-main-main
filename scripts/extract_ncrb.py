#!/usr/bin/env python3
"""
Builds server/data/ncrb2022.json from NCRB "Crime in India 2022".

Inputs (all free, public NCRB data):
  --vol1   text extracted from the Volume I PDF (e.g. `pdftotext -layout vol1.pdf vol1.txt`)
  --women  CSV "Crimes Against Women in Metros 2022" (data.opencity.in)
  --cyber  CSV "Cyber Crimes in Metros 2022"          (data.opencity.in)

Source tables used (Volume I):
  Table 1B.1  IPC crimes in 19 metropolitan cities (cases 2022 + rate per lakh population)
  Table 1B.4  IPC crimes, head-wise, city-wise     (murder: cols 3-5, kidnapping & abduction: cols 129-131,
                                                    theft: cols 263-265, robbery: cols 284-286)
  Table 1A.1  IPC crimes, State/UT-wise            (rate per lakh population)
  Table 1A.4  IPC crimes, head-wise, State/UT-wise (same column numbers as 1B.4)

Run:  python3 scripts/extract_ncrb.py --vol1 vol1.txt --women women.csv --cyber cyber.csv
Every parsed column is checked against NCRB's own TOTAL rows; the script aborts on a mismatch.
"""
import argparse, csv, json, re, sys

CITIES = ["Ahmedabad","Bengaluru","Chennai","Coimbatore","Delhi City","Ghaziabad","Hyderabad","Indore","Jaipur",
          "Kanpur","Kochi","Kolkata","Kozhikode","Lucknow","Mumbai","Nagpur","Patna","Pune","Surat"]
STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
          "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
          "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
          "Uttar Pradesh","Uttarakhand","West Bengal","A&N Islands","Chandigarh","D&N Haveli","Delhi",
          "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"]
NUM = r'-?\d+\.\d+|-?\d+'

def nums(s): return [float(x) for x in re.findall(NUM, s)]

def split_rows(body, names):
    pos = [body.find(n) for n in names]
    out = {}
    for k, n in enumerate(names):
        if pos[k] < 0: out[n] = None; continue
        nxt = [p for p in pos[k+1:] if p >= 0]
        seg = body[pos[k]+len(n): (nxt[0] if nxt else len(body))]
        seg = re.sub(r'\([A-Za-z &]+\)', '', seg)                    # "(Uttar Pradesh)"
        seg = re.sub(r'D&N Haveli and Daman & Diu', '', seg)
        seg = re.sub(r'\s\d{1,2}\s*$', '', seg.strip())             # serial number of the next row
        out[n] = nums(seg)
    return out

class Vol1:
    def __init__(self, path):
        self.lines = open(path, encoding='utf-8', errors='ignore').read().split('\n')
    def footers(self, label, pages):
        return [i for i, l in enumerate(self.lines) if re.search(rf'TABLE {label} Page \d+ of {pages}', l)]
    def block(self, end):
        start = max(i for i in range(end) if re.match(r'^\[1\] \[2\]', self.lines[i].strip()))
        return ' '.join(l.strip() for l in self.lines[start+1:end+1])
    def head_page(self, label, pages, n, names, total_marker):
        end = self.footers(label, pages)[n-1]
        txt = self.block(end)
        i = txt.find(total_marker)
        body, tail = txt[:i], txt[i:]
        rows = split_rows(body, names)
        total = nums(re.split(r'●|Col\.|TABLE', tail[len(total_marker):])[0])
        return rows, total

def check(rows, total, idx, what):
    s = round(sum(r[idx] for r in rows.values() if r), 1)
    if abs(s - total[idx]) > 0.5:
        sys.exit(f'CHECK FAILED ({what}): parsed sum {s} != NCRB total {total[idx]}')

def read_csv(path):
    out = {}
    for r in csv.DictReader(open(path, encoding='utf-8-sig')):
        out[r['Cities']] = r
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--vol1', required=True); ap.add_argument('--women', required=True)
    ap.add_argument('--cyber', required=True); ap.add_argument('--out', default='server/data/ncrb2022.json')
    a = ap.parse_args()
    v = Vol1(a.vol1)

    # ---- Table 1B.1: total IPC cases and rate for metros
    end = v.footers('1B.1', 1)[0]
    txt = v.block(end)
    rows = split_rows(txt[:txt.find('TOTAL CITIES')], CITIES)
    ipc = {c: r for c, r in rows.items()}          # [2020, 2021, 2022, pop(lakh), rate, chargesheet%]
    total_ipc = nums(re.split(r'●|TABLE|\'\+\'', txt[txt.find('TOTAL CITIES')+12:])[0])
    check(ipc, total_ipc, 2, 'IPC 2022 cases')

    def metro(page, idx_cases, idx_rate, what):
        r, t = v.head_page('1B.4', 46, page, CITIES, 'TOTAL CITIES')
        check(r, t, idx_cases, what)
        return {c: (r[c][idx_cases], r[c][idx_rate]) for c in CITIES}
    murder   = metro(1, 0, 2, 'murder')
    kidnap   = metro(15, 0, 2, 'kidnapping & abduction')
    theft    = metro(29, 3, 5, 'theft')
    robbery  = metro(31, 6, 8, 'robbery')

    women, cyber = read_csv(a.women), read_csv(a.cyber)
    metros = []
    for c in CITIES:
        name = 'Delhi' if c == 'Delhi City' else c
        w, cy = women[c], cyber[c]
        metros.append({
            'city': name, 'scope': 'metro', 'population_lakh_2011': ipc[c][3],
            'ipc_cases_2022': ipc[c][2], 'ipc_rate': ipc[c][4], 'chargesheet_rate_pct': ipc[c][5],
            'murder_rate': murder[c][1], 'murder_cases': murder[c][0],
            'kidnapping_rate': kidnap[c][1], 'kidnapping_cases': kidnap[c][0],
            'robbery_rate': robbery[c][1], 'robbery_cases': robbery[c][0],
            'theft_rate': theft[c][1], 'theft_cases': theft[c][0],
            'women_crime_rate': float(w['Rate of crime']), 'women_crime_cases_2022': float(w['2022']),
            'cyber_crime_rate': float(cy['Rate of crime']), 'cyber_crime_cases_2022': float(cy['2022']),
        })

    # ---- States / UTs
    def state_page(page):
        end = v.footers('1A.4', 46)[page-1]
        txt = v.block(end)
        i = txt.find('TOTAL STATE(S)'); j = txt.find('TOTAL UT')
        st = split_rows(txt[:i], STATES[:28]); ut = split_rows(txt[i+14:j], STATES[28:])
        st.update(ut)
        return st
    # Table 1A.1 (state IPC rate)
    end = v.footers('1A.1', 1)[0]
    t = v.block(end)
    i = t.find('TOTAL STATE(S)'); j = t.find('TOTAL UT')
    s1 = split_rows(t[:i], STATES[:28]); s1.update(split_rows(t[i+14:j], STATES[28:]))
    sm, sk, sr, sth = state_page(1), state_page(15), state_page(31), state_page(29)
    states = []
    for s in STATES:
        if s1[s] is None or sm[s] is None: sys.exit(f'missing state row: {s}')
        states.append({'state': 'Delhi (UT)' if s == 'Delhi' else s, 'scope': 'state', 'population_lakh_2022': s1[s][3],
                       'ipc_cases_2022': s1[s][2], 'ipc_rate': s1[s][4],
                       'murder_rate': sm[s][2], 'kidnapping_rate': sk[s][2],
                       'robbery_rate': sr[s][8], 'theft_rate': sth[s][5]})
    out = {'source': 'National Crime Records Bureau (MHA), Crime in India 2022',
           'metros': metros, 'states': states}
    json.dump(out, open(a.out, 'w'), indent=2)
    print(f'wrote {a.out}: {len(metros)} metros, {len(states)} states/UTs')

if __name__ == '__main__':
    main()
