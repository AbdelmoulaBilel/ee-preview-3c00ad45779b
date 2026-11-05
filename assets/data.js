/* Invented sample data. No real brands, people or addresses. Everything stays in this browser. */
var TODAY = new Date(2026, 10, 5); // Thursday 5 November 2026, a send day
var STAGES = ['Not contacted', 'Emailing', 'Replied', 'Talking', 'Shortlist sent', 'Won', 'Not now'];
var STAGE_TOTALS = { brand: [760, 402, 71, 26, 17, 6, 52], creator: [1080, 410, 93, 32, 6, 3, 42] };
var OPTED_TOTAL = 42;
var WAITING_TOTAL = 46;
var NICHES = ['Accounting', 'AI tools', 'AI writing', 'Analytics', 'Design tools', 'Developer tools', 'DevOps', 'Ecommerce AI', 'Finance software', 'Fintech', 'No-code', 'Privacy', 'Productivity', 'SaaS reviews', 'Security', 'Video AI', 'Voice AI'];
var NEAR = {
  Security: ['Privacy'], Privacy: ['Security'], 'Developer tools': ['DevOps'], DevOps: ['Developer tools'],
  'AI tools': ['AI writing', 'Video AI', 'Voice AI'], 'AI writing': ['AI tools', 'Productivity'], Productivity: ['AI writing', 'No-code'],
  'No-code': ['Productivity'], 'Finance software': ['Fintech', 'Accounting'], Fintech: ['Finance software'], Accounting: ['Finance software'],
  'Design tools': ['Video AI'], 'Video AI': ['Design tools', 'AI tools'], 'Voice AI': ['AI tools'], Analytics: ['SaaS reviews'], 'SaaS reviews': ['Analytics'], 'Ecommerce AI': ['AI tools']
};
var STATUS = {
  needs: ['Needs you', 'b-gold'], new: ['Not contacted', 'b-neutral'], emailing: ['Emailing', 'b-blue'], replied: ['Replied', 'b-blue'],
  talking: ['Talking', 'b-blue'], shortlist: ['Shortlist sent', 'b-blue'], paused: ['Paused', 'b-neutral'], notnow: ['Not now', 'b-neutral'],
  won: ['Won', 'b-violet'], never: ['Never email', 'b-red'], checking: ['Checking', 'b-blue']
};
var MAIL = { real: 'Real', unsure: 'Unsure', notreal: 'Not real', none: 'Not checked' };

// id, kind, name, contact, role, niche, days since added, address, days since contacted (null = never), status, stage, next step
function L(id, kind, name, contact, role, niche, added, mail, cd, st, stage, next, extra) {
  var slug = name.toLowerCase().replace(/[^a-z]/g, '');
  var first = (contact || name).split(' ')[0];
  return Object.assign({ id: id, kind: kind, name: name, contact: contact, role: role, niche: niche, added: added, mail: mail, cd: cd, st: st, stage: stage, next: next,
    email: kind === 'brand' ? first.toLowerCase() + '@' + slug + '.example' : first.toLowerCase() + '@' + slug + '.example',
    site: kind === 'brand' ? slug + '.example' : 'youtube.com/@' + slug, city: '', sells: '', size: '', web: '', note: '', rate: '', enriched: false }, extra || {});
}
var HAND_LEADS = [
  L('vaultly', 'brand', 'Vaultly', 'Mara Quinn', 'Head of Partnerships', 'Security', 9, 'real', 3, 'emailing', 'Emailing', 'Follow up 1 sends today', { city: 'Austin, Texas', sells: 'A VPN and password manager bundle for families', size: 'About 60 people', web: 'Launched a family plan in October', enriched: true, others: [{ name: 'Ken Abe', role: 'Marketing lead', email: 'ken@vaultly.example', mail: 'unsure' }] }),
  L('shieldpath', 'brand', 'Shieldpath', 'Noah Berg', 'Partnerships', 'Security', 3, 'notreal', null, 'needs', 'Not contacted', 'Use Sofia instead of Noah', { others: [{ name: 'Sofia Lindqvist', role: 'Head of Growth', email: 'sofia@shieldpath.example', mail: 'real' }] }),
  L('ledgerbird', 'brand', 'Ledgerbird', 'Priya Nair', 'Marketing', 'Finance software', 2, 'unsure', null, 'needs', 'Not contacted', 'Approve first email'),
  L('codeharbor', 'brand', 'Codeharbor', 'Daniel Okafor', 'Marketing', 'Developer tools', 21, 'real', 10, 'needs', 'Replied', 'Send shortlist'),
  L('promptloom', 'brand', 'Promptloom', 'Ines Duarte', 'Growth', 'AI writing', 18, 'real', 9, 'paused', 'Replied', 'Out of office until Monday'),
  L('fundrail', 'brand', 'Fundrail', 'Tom Achterberg', 'Partnerships', 'Fintech', 16, 'real', 10, 'needs', 'Replied', 'Approve Tom’s first email', { others: [{ name: 'Lena Brandt', role: 'Moved teams', email: 'lena@fundrail.example', mail: 'real' }] }),
  L('pixelforge', 'brand', 'Pixelforge', 'Owen Hart', 'Brand', 'Design tools', 30, 'real', 17, 'notnow', 'Not now', 'Try again 2 March'),
  L('brightcart', 'brand', 'Brightcart', 'Hugo Lam', 'Founder', 'Ecommerce AI', 4, 'real', null, 'needs', 'Not contacted', 'Approve first email'),
  L('orbitly', 'brand', 'Orbitly', 'Rhea Das', 'Marketing', 'Analytics', 1, 'real', null, 'needs', 'Not contacted', 'Approve first email'),
  L('voxly', 'brand', 'Voxly', 'Elena Ross', 'Growth', 'Voice AI', 12, 'real', 1, 'emailing', 'Emailing', 'Follow up 1 on Monday'),
  L('notewell', 'brand', 'Notewell', 'Felix Grant', 'Partnerships', 'Productivity', 14, 'real', 7, 'won', 'Won', 'Campaign starts in January'),
  L('stackpilot', 'brand', 'Stackpilot', 'Jade Wu', 'Marketing', 'DevOps', 6, 'real', 2, 'talking', 'Talking', 'Call booked Tuesday'),
  L('clearframe', 'brand', 'Clearframe', 'Adam Cole', 'Founder', 'Video AI', 0, 'none', null, 'checking', 'Not contacted', 'Checking the address'),
  L('hexabridge', 'brand', 'Hexabridge Analytics and Reporting Platform International', 'Priyanka Ramaswamy-Fitzgerald', 'Head of Partner Marketing', 'Analytics', 25, 'real', 14, 'emailing', 'Emailing', 'Last follow up on Monday'),
  L('ledgerly', 'brand', 'Ledgerly', 'Sam Ito', 'Growth', 'Finance software', 27, 'real', 14, 'emailing', 'Emailing', 'Follow up 2 on Monday'),
  L('maya', 'creator', 'Maya Torres', 'Maya Torres', 'YouTube', 'Security', 5, 'real', null, 'needs', 'Not contacted', 'Approve first email', { followers: '210k subscribers', note: 'Reviews password managers.', rate: '$3,500 a video' }),
  L('leo', 'creator', 'Leo Bastien', 'Leo Bastien', 'Newsletter', 'Privacy', 8, 'real', 3, 'emailing', 'Emailing', 'Follow up 1 sends today', { followers: '48k readers', note: 'Weekly privacy tools issue.' }),
  L('ana', 'creator', 'Ana Ruiz', 'Ana Ruiz', 'YouTube', 'Productivity', 20, 'real', 10, 'needs', 'Replied', 'Interested. Reply in Gmail', { followers: '96k subscribers' }),
  L('jonah', 'creator', 'Jonah Reyes', 'Jonah Reyes', 'Instagram', 'Design tools', 7, 'notreal', null, 'needs', 'Not contacted', 'Message on LinkedIn', { followers: '130k followers' }),
  L('kai', 'creator', 'Kai Nakamura', 'Kai Nakamura', 'TikTok', 'AI tools', 4, 'real', null, 'needs', 'Not contacted', 'Approve first email', { followers: '320k followers' }),
  L('ravi', 'creator', 'Ravi Menon', 'Ravi Menon', 'YouTube', 'Developer tools', 26, 'real', 9, 'emailing', 'Emailing', 'Follow up 2 on Monday', { followers: '184k subscribers', note: 'Teaches web development.', rate: '$4,000 a video' }),
  L('sam', 'creator', 'Sam Okoro', 'Sam Okoro', 'Twitch', 'Developer tools', 24, 'real', 9, 'emailing', 'Emailing', 'Follow up 2 on Monday', { followers: '62k followers', note: 'Builds apps live.' }),
  L('lina', 'creator', 'Lina Park', 'Lina Park', 'Podcast', 'Developer tools', 22, 'real', 8, 'talking', 'Talking', 'Waiting on her rate card', { followers: '40k listeners', note: 'Interviews developer tool founders.', rate: '$1,800 an episode' }),
  L('theo', 'creator', 'Theo Grant', 'Theo Grant', 'YouTube', 'Design tools', 11, 'unsure', null, 'needs', 'Not contacted', 'Approve first email', { followers: '77k subscribers' }),
  L('zoe', 'creator', 'Zoe Lambert', 'Zoe Lambert', 'YouTube', 'Finance software', 13, 'real', 7, 'emailing', 'Emailing', 'Follow up 2 on Monday', { followers: '145k subscribers' }),
  L('omar', 'creator', 'Omar Haddad', 'Omar Haddad', 'Newsletter', 'AI tools', 10, 'real', 3, 'emailing', 'Emailing', 'Follow up 1 sends today', { followers: '66k readers' }),
  L('nina', 'creator', 'Nina Kovacs', 'Nina Kovacs', 'YouTube', 'No-code', 15, 'real', 1, 'emailing', 'Emailing', 'Follow up 1 on Monday', { followers: '39k subscribers' }),
  L('ben', 'creator', 'Ben Ortiz', 'Ben Ortiz', 'YouTube', 'DevOps', 19, 'real', 10, 'emailing', 'Emailing', 'Last follow up on Monday', { followers: '51k subscribers' }),
  L('elsa', 'creator', 'Elsa Moreau', 'Elsa Moreau', 'Instagram', 'Video AI', 28, 'real', 17, 'won', 'Won', 'Posting for Clearframe', { followers: '88k followers' }),
  L('marcus', 'creator', 'Marcus Lee', 'Marcus Lee', 'YouTube', 'SaaS reviews', 2, 'real', null, 'needs', 'Not contacted', 'Approve first email', { followers: '260k subscribers' }),
  L('quietnet', 'brand', 'Quietnet', '', 'Whole company', 'Privacy', 40, 'real', 28, 'never', 'Not now', 'Opted out on 12 Oct', { optedOut: true, optWhy: 'Asked not to be contacted', optWhen: '12 Oct' }),
  L('tallyhq', 'brand', 'Tallyhq', 'Grace Lin', 'Marketing', 'Accounting', 35, 'real', 3, 'never', 'Not now', 'Opted out on 3 Nov', { optedOut: true, optWhy: 'Replied “please remove me”', optWhen: '3 Nov' }),
  L('haloforms', 'brand', 'Haloforms', '', 'Whole company', 'No-code', 33, 'real', null, 'never', 'Not now', 'Added by Kamal on 21 Oct', { optedOut: true, optWhy: 'Added by Kamal', optWhen: '21 Oct' })
];

// Generates a realistic list of 3,000 so search, filters and paging can be tried at real size.
var A = ['Zor', 'Quel', 'Tav', 'Vex', 'Nol', 'Brim', 'Kest', 'Ulv', 'Yar', 'Fen', 'Jor', 'Mir', 'Ost', 'Ryl', 'Sev', 'Thal', 'Wex', 'Ixo', 'Drav', 'Cael'];
var B = ['ano', 'ora', 'ivo', 'exa', 'una', 'ara', 'elo', 'ixa', 'ovo', 'enta'];
var C = ['', 'ly', 'hq', 'labs', 'works', 'base', 'stack', 'wave'];
var FIRST = ['Alma', 'Bruno', 'Clara', 'Dario', 'Edith', 'Farid', 'Greta', 'Hanna', 'Ivan', 'Julia', 'Karim', 'Lucia', 'Mateo', 'Nadia', 'Oskar', 'Paula', 'Quinn', 'Rosa', 'Stefan', 'Tessa', 'Uri', 'Vera', 'Wes', 'Xenia', 'Yusuf', 'Zara', 'Amir', 'Bea', 'Cyrus', 'Dina'];
var LAST = ['Adler', 'Boyd', 'Costa', 'Dahl', 'Egan', 'Frost', 'Gill', 'Hale', 'Ibarra', 'Joshi', 'Keller', 'Lund', 'Mora', 'Nash', 'Ochoa', 'Pike', 'Quigley', 'Reyes', 'Shah', 'Toft', 'Urban', 'Vance', 'Weiss', 'Yates', 'Zamora', 'Alder', 'Blum', 'Crane', 'Doyle', 'Ewing', 'Fahey', 'Gage', 'Holt', 'Irwin', 'Jain', 'Kerr', 'Lowe', 'Marsh', 'Noor', 'Orr', 'Park', 'Rusk', 'Sayer', 'Tully', 'Voss', 'Wynn', 'York', 'Zeller', 'Aske', 'Birch', 'Cobb', 'Dunn', 'Ennis', 'Fitch', 'Gray', 'Hobbs', 'Ide'];
var PLATFORM = [['YouTube', 'subscribers'], ['Newsletter', 'readers'], ['Podcast', 'listeners'], ['Instagram', 'followers'], ['TikTok', 'followers']];
var ROLES = ['Marketing', 'Growth', 'Partnerships', 'Brand', 'Founder'];
var NEXT_BY_STAGE = { 'Not contacted': 'Waiting for your approval', Emailing: 'Follow up on Monday', Replied: 'Answered in Gmail', Talking: 'Reply in Gmail', 'Shortlist sent': 'Waiting for their pick', Won: 'Campaign running', 'Not now': 'Try again in spring' };
var ST_BY_STAGE = { 'Not contacted': 'new', Emailing: 'emailing', Replied: 'replied', Talking: 'talking', 'Shortlist sent': 'shortlist', Won: 'won', 'Not now': 'notnow' };

function buildLeads() {
  var out = HAND_LEADS.slice(), seq = 0;
  ['brand', 'creator'].forEach(function (kind) {
    STAGES.forEach(function (stage, si) {
      var have = HAND_LEADS.filter(function (l) { return l.kind === kind && l.stage === stage && !l.optedOut; }).length;
      var n = STAGE_TOTALS[kind][si] - have;
      for (var i = 0; i < n; i++) {
        seq++;
        var mix = seq * 997 % 1600, a = mix % A.length, b = Math.floor(mix / A.length) % B.length, c = Math.floor(mix / (A.length * B.length)) % C.length;
        var niche = NICHES[seq * 7 % NICHES.length];
        var person = FIRST[seq % FIRST.length] + ' ' + LAST[Math.floor(seq / FIRST.length) % LAST.length];
        var contacted = stage === 'Not contacted' ? null : 2 + seq % 40;
        if (kind === 'brand') {
          var bn = A[a] + B[b] + C[c];
          out.push(L('g' + seq, 'brand', bn, person, ROLES[seq % ROLES.length], niche, 3 + seq % 200, seq % 23 === 0 ? 'unsure' : 'real', contacted, ST_BY_STAGE[stage], stage, NEXT_BY_STAGE[stage]));
        } else {
          var p = PLATFORM[seq % PLATFORM.length];
          out.push(L('g' + seq, 'creator', person, person, p[0], niche, 3 + seq % 200, seq % 23 === 0 ? 'unsure' : 'real', contacted, ST_BY_STAGE[stage], stage, NEXT_BY_STAGE[stage], { followers: (20 + seq % 280) + 'k ' + p[1], email: person.split(' ')[0].toLowerCase() + seq + '@creator.example' }));
        }
      }
    });
  });
  for (var i = 0; i < OPTED_TOTAL - 3; i++) {
    seq++;
    var nm = A[seq % A.length] + B[(seq + 3) % B.length] + 'co';
    out.push(L('g' + seq, 'brand', nm, FIRST[seq % FIRST.length] + ' ' + LAST[seq % LAST.length], 'Marketing', NICHES[seq % NICHES.length], 40 + i, 'real', 30 + i, 'never', 'Not now', 'Opted out', { optedOut: true, optWhy: 'Replied “stop”', optWhen: 'Oct' }));
  }
  return out;
}

var SIG_BRAND = 'Kamal · Founder, Elite Edge Collective · eliteedge.example';
var SIG_CREATOR = 'Kamal · Partnerships, Elite Edge Collective · eliteedge.example';
var FOOTER = 'Not interested? Reply “stop” and we won’t write again.\nElite Edge Collective, 100 Sample Street, Austin TX 78701';

var TEMPLATES = {
  brand: [
    { label: 'First email', subject: 'Creators for {company}', body: 'Hi {first},\n\nI run Elite Edge Collective. We match {niche} brands with creators whose audience already trusts them.\n\nWould a short list of three creators, with rough pricing, be useful for {company}?\n\nKamal' },
    { label: 'Follow up 1', subject: 'Re: Creators for {company}', body: 'Hi {first},\n\nA quick follow up in case this got buried. Happy to send three names this week, no call needed.\n\nKamal' },
    { label: 'Follow up 2', subject: 'One idea for {company}', body: 'Hi {first},\n\nOne idea: a creator in {niche} walking through {company} step by step. These videos keep working for months.\n\nWant me to find two who would do it?\n\nKamal' },
    { label: 'Follow up 3', subject: 'Last note from me', body: 'Hi {first},\n\nI won’t keep writing. If creators ever make sense for {company}, reply to this and I’ll send a shortlist the same day.\n\nKamal' }
  ],
  creator: [
    { label: 'First email', subject: 'Paid work with {niche} brands', body: 'Hi {first},\n\nI run Elite Edge Collective. We place creators with AI and software brands, and your work in {niche} is a good fit.\n\nCan I send you two brands looking for sponsors?\n\nKamal' },
    { label: 'Follow up 1', subject: 'Re: Paid work with {niche} brands', body: 'Hi {first},\n\nA quick follow up in case this got buried. Happy to send the two brands, no call needed.\n\nKamal' },
    { label: 'Follow up 2', subject: 'Are you taking sponsors?', body: 'Hi {first},\n\nIf you take sponsors, what does your calendar look like for next quarter?\n\nKamal' },
    { label: 'Follow up 3', subject: 'Last note from me', body: 'Hi {first},\n\nI won’t keep writing. If sponsors ever make sense, reply to this and I’ll send what we have.\n\nKamal' }
  ]
};

var FLAGGED = [
  { id: 'f1', lead: 'ledgerbird', name: 'Priya Nair', company: 'Ledgerbird', why: 'Unsure address', first: 'Priya', to: 'Priya Nair, Ledgerbird · priya@ledgerbird.example', from: 'Kamal, brand inbox', when: 'Mon 9 Nov, 10:14 AM their time', creator: false, flag: 'the address is unsure. Ledgerbird accepts every address, so we can’t confirm Priya gets it.', subject: 'Creators for Ledgerbird’s spring launch',
    body: 'Hi Priya,\n\nI run Elite Edge Collective. We match finance software brands with creators whose audience already trusts them on money topics.\n\nWould a short list of three creators in personal finance be useful for your spring launch?\n\nKamal' },
  { id: 'f2', lead: 'fundrail', name: 'Tom Achterberg', company: 'Fundrail', why: 'New contact', first: 'Tom', to: 'Tom Achterberg, Fundrail · tom@fundrail.example', from: 'Kamal, brand inbox', when: 'Mon 9 Nov, 9:40 AM their time', creator: false, flag: 'new contact. Lena named Tom in her reply, so this is the first email to him.', subject: 'Lena suggested I write to you',
    body: 'Hi Tom,\n\nLena mentioned you now look after partnerships at Fundrail.\n\nWe connect fintech brands with creators who explain money clearly. Would it help if I sent three names with rough pricing?\n\nKamal' },
  { id: 'f3', lead: 'maya', name: 'Maya Torres', company: 'Creator · YouTube', why: 'Edited by you', first: 'Maya', to: 'Maya Torres · maya@mayatorres.example', from: 'Kamal, partnerships inbox', when: 'Mon 9 Nov, 11:02 AM their time', creator: true, flag: 'you edited this one by hand on Tuesday.', subject: 'A security brand that fits your channel',
    body: 'Hi Maya,\n\nYour June video on password managers was the clearest one I’ve seen.\n\nI work with Vaultly, a VPN and password bundle. They’re looking for one or two security creators for the spring. Would you be open to a paid video?\n\nKamal' },
  { id: 'f4', lead: 'brightcart', name: 'Hugo Lam', company: 'Brightcart', why: 'Rewritten with AI', first: 'Hugo', to: 'Hugo Lam, Brightcart · hugo@brightcart.example', from: 'Kamal, brand inbox', when: 'Mon 9 Nov, 1:20 PM their time', creator: false, flag: 'rewritten with AI (warmer) yesterday. Check that it still sounds like you.', subject: 'Creators who sell to shop owners',
    body: 'Hi Hugo,\n\nHope the week is treating you well. I’ve been following Brightcart for a while and really like where it’s going.\n\nWe work with creators whose audience runs small online shops. Would a shortlist with prices be useful?\n\nKamal' },
  { id: 'f5', lead: 'kai', name: 'Kai Nakamura', company: 'Creator · TikTok', why: 'No first name', first: 'Kai', to: 'Kai Nakamura · hello@kainakamura.example', from: 'Kamal, partnerships inbox', when: 'Mon 9 Nov, 3:05 PM their time', creator: true, flag: 'we couldn’t find a first name, so it starts with “Hi there”.', subject: 'Paid work with AI tool brands',
    body: 'Hi there,\n\nI run Elite Edge Collective. We place creators with AI and software brands, and your short videos on AI tools are a good fit.\n\nCan I send you two brands that want to sponsor creators this spring?\n\nKamal' },
  { id: 'f6', lead: 'orbitly', name: 'Rhea Das', company: 'Orbitly', why: 'New template', first: 'Rhea', to: 'Rhea Das, Orbitly · rhea@orbitly.example', from: 'Kamal, brand inbox', when: 'Mon 9 Nov, 9:55 AM their time', creator: false, flag: 'this is the first email from your new template, “Launch week”.', subject: 'Creators for Orbitly’s launch week',
    body: 'Hi Rhea,\n\nLaunch weeks go further when a few trusted creators show the product on day one.\n\nWe can line up three analytics and SaaS creators for Orbitly. Want the list?\n\nKamal' }
];
var SOFIA = { id: 'f7', lead: 'shieldpath', name: 'Sofia Lindqvist', company: 'Shieldpath', why: 'New contact', first: 'Sofia', to: 'Sofia Lindqvist, Shieldpath · sofia@shieldpath.example', from: 'Kamal, brand inbox', when: 'Mon 9 Nov, 9:20 AM their time', creator: false, flag: 'new contact. We replaced noah@, which is not a real address.', subject: 'Creators for Shieldpath',
  body: 'Hi Sofia,\n\nWe match security brands with creators whose viewers already care about staying safe online.\n\nWould three names with rough pricing be useful for Shieldpath this spring?\n\nKamal' };
var POOL = [
  { name: 'Mara Quinn', company: 'Vaultly', lead: 'vaultly', inbox: 'brand', subject: 'Re: Creators for Vaultly', body: 'Hi Mara,\n\nA quick follow up on the creators I mentioned. Happy to send three names this week, no call needed.\n\nKamal' },
  { name: 'Leo Bastien', company: 'Creator · Newsletter', lead: 'leo', inbox: 'partner', subject: 'Privacy brands that want newsletter sponsors', body: 'Hi Leo,\n\nYour weekly privacy tools issue is exactly what two of our brands are looking for. Open to a paid placement?\n\nKamal' },
  { name: 'Ines Duarte', company: 'Promptloom', lead: 'promptloom', inbox: 'brand', subject: 'Creators for Promptloom', body: 'Hi Ines,\n\nWe work with creators who teach AI writing to marketers. Would a shortlist help for your next launch?\n\nKamal' },
  { name: 'Ravi Menon', company: 'Creator · YouTube', lead: 'ravi', inbox: 'partner', subject: 'Developer tool sponsors for your channel', body: 'Hi Ravi,\n\nTwo developer tool brands are looking for a creator who teaches working engineers. Interested?\n\nKamal' },
  { name: 'Jade Wu', company: 'Stackpilot', lead: 'stackpilot', inbox: 'brand', subject: 'Creators who review DevOps tools', body: 'Hi Jade,\n\nStackpilot came up when I was looking for DevOps tools that creators actually use. Want three names?\n\nKamal' },
  { name: 'Omar Haddad', company: 'Creator · Newsletter', lead: 'omar', inbox: 'partner', subject: 'AI brands that sponsor tool reviews', body: 'Hi Omar,\n\nYour AI tools roundup is a great fit for a few brands we work with. Open to sponsors this spring?\n\nKamal' },
  { name: 'Elena Ross', company: 'Voxly', lead: 'voxly', inbox: 'brand', subject: 'Creators for Voxly’s voice launch', body: 'Hi Elena,\n\nVoice AI is easiest to sell when people hear it. We know creators who demo tools live. Want the list?\n\nKamal' },
  { name: 'Nina Kovacs', company: 'Creator · YouTube', lead: 'nina', inbox: 'partner', subject: 'No-code brands looking for creators', body: 'Hi Nina,\n\nA few no-code brands want sponsored tutorials in January. Can I send you two?\n\nKamal' },
  { name: 'Felix Grant', company: 'Notewell', lead: 'notewell', inbox: 'brand', subject: 'Creators who teach note taking', body: 'Hi Felix,\n\nProductivity creators drive steady sign ups for note apps. Would three names help?\n\nKamal' },
  { name: 'Ben Ortiz', company: 'Creator · YouTube', lead: 'ben', inbox: 'partner', subject: 'DevOps sponsors for your streams', body: 'Hi Ben,\n\nStackpilot is looking for someone who builds and ships live. Interested in a paid stream?\n\nKamal' }
];
var TIMES = ['9:12 AM', '9:20 AM', '9:31 AM', '9:44 AM', '10:02 AM', '10:15 AM', '10:30 AM', '10:41 AM', '11:05 AM', '11:22 AM'];
var REPLIES = [
  { id: 'codeharbor', lead: 'codeharbor', from: 'Daniel Okafor', company: 'Codeharbor', when: 'Today 11:48 AM', type: 'Send shortlist', needs: true, quote: 'This sounds useful. Could you send a few developer creators with rough pricing? We’d like to start in December.', did: 'Follow ups stopped. Matching creators are ready to pick.' },
  { id: 'ana', lead: 'ana', from: 'Ana Ruiz', company: 'Creator · YouTube', when: 'Today 9:31 AM', type: 'Interested', needs: true, quote: 'Yes, I’m open to sponsors from January. My rate card is attached.', did: 'Follow ups stopped. Her rate card is in the Gmail thread.' },
  { id: 'fundrail', lead: 'fundrail', from: 'Lena Brandt', company: 'Fundrail', when: 'Wed 3:02 PM', type: 'Wrong person', needs: true, quote: 'I’ve moved teams. Tom Achterberg handles partnerships now.', did: 'Follow ups to Lena stopped. Tom’s first email waits for your approval.' },
  { id: 'promptloom', lead: 'promptloom', from: 'Ines Duarte', company: 'Promptloom', when: 'Wed 8:40 AM', type: 'Out of office', needs: false, quote: 'I’m out until Monday with limited access to email.', did: 'Follow ups paused, not stopped. They restart Tuesday 10 Nov.' },
  { id: 'pixelforge', lead: 'pixelforge', from: 'Owen Hart', company: 'Pixelforge', when: 'Wed 9:15 AM', type: 'Not now', needs: false, quote: 'Not the right time for us. Try again in spring?', did: 'Follow ups stopped. Moved to try again on 2 March 2027.' },
  { id: 'tallyhq', lead: 'tallyhq', from: 'Grace Lin', company: 'Tallyhq', when: 'Tue 4:20 PM', type: 'Not interested', needs: false, quote: 'Thanks, but we don’t work with creators. Please remove me.', did: 'Follow ups stopped. Added to the opt-out list for good.' }
];
var REPLY_TYPES = ['Send shortlist', 'Interested', 'Wrong person', 'Out of office', 'Not now', 'Not interested'];
var SINCE = [
  { badge: 'b-green', word: 'Sent', when: 'Wednesday', what: '240 emails went out across both inboxes, all inside the send windows.' },
  { badge: 'b-neutral', word: 'Paused', when: 'Wed 8:40 AM', what: 'Promptloom is out of office until Monday. Follow ups restart Tuesday.' },
  { badge: 'b-neutral', word: 'Not now', when: 'Wed 9:15 AM', what: 'Pixelforge said not now. Moved to try again in March.' },
  { badge: 'b-red', word: 'Bounced', when: 'Wed 10:02 AM', what: '2 addresses bounced. Follow ups stopped for both.' },
  { badge: 'b-green', word: 'Checked', when: 'Wed 10:30 AM', what: '41 new people checked: 36 real addresses, 3 unsure, 2 not real.' },
  { badge: 'b-red', word: 'Never email', when: 'Tue 4:22 PM', what: 'Tallyhq asked not to be emailed. Added to the opt-out list for good.' }
];
var LOG = [
  { when: 'Today 11:52 AM', who: 'App', what: 'Stopped follow ups to Codeharbor after Daniel replied.' },
  { when: 'Today 9:01 AM', who: 'App', what: 'Started Thursday’s sending: 240 approved emails.' },
  { when: 'Wed 3:04 PM', who: 'App', what: 'Added Tom Achterberg at Fundrail from Lena’s reply.' },
  { when: 'Tue 4:22 PM', who: 'App', what: 'Added Tallyhq to the opt-out list after Grace asked.' },
  { when: 'Tue 3:40 PM', who: 'Kamal', what: 'Approved 480 emails for Wednesday and Thursday.' },
  { when: 'Tue 10:20 AM', who: 'Kamal', what: 'Edited the first email to Maya Torres.' },
  { when: 'Mon 9:00 AM', who: 'Kamal', what: 'Changed the partnerships daily limit to 100 for week 3.' }
];
var EXTRA_OPTOUTS = [
  { who: 'press@vantagebox.example', why: 'Replied “stop”', when: '29 Oct' },
  { who: 'tim@quillstack.example', why: 'Used the opt-out line', when: '14 Oct' },
  { who: 'nora@pebblepay.example', why: 'Imported from your Sheet', when: '2 Oct' }
];
var CITIES = ['Austin, Texas', 'Toronto, Canada', 'Denver, Colorado', 'Berlin, Germany', 'London, UK', 'Seattle, Washington', 'Lisbon, Portugal'];
var SELLS = { Security: 'Security software for small teams', Privacy: 'Privacy tools for families', 'Developer tools': 'Tools that help developers ship faster', DevOps: 'Cloud deployment software', 'AI tools': 'AI assistants for small businesses', 'AI writing': 'An AI writing assistant', Productivity: 'A task and notes app', 'No-code': 'A no-code app builder', 'Finance software': 'Invoicing and bookkeeping software', Fintech: 'Business cards and payments', Accounting: 'Accounting software', 'Design tools': 'Design software for teams', 'Video AI': 'AI video editing', 'Voice AI': 'AI voice tools', Analytics: 'Product analytics software', 'SaaS reviews': 'Software comparison tools', 'Ecommerce AI': 'AI tools for online shops' };
