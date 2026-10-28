/* SweepX demo services.
   This browser-only data layer keeps the demonstration independent of Supabase.
   Data exists for the current page session only; no credentials or user data are persisted. */

const DEMO_IMAGE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <rect width="900" height="600" fill="#172217"/><circle cx="160" cy="130" r="95" fill="#314d2c"/>
    <path d="M0 470 Q250 350 470 460 T900 410 V600 H0Z" fill="#243d28"/>
    <text x="450" y="290" text-anchor="middle" fill="#7CFF3B" font-family="Arial" font-size="32" font-weight="700">SWEEPX DEMO</text>
    <text x="450" y="335" text-anchor="middle" fill="#fff" opacity=".7" font-family="Arial" font-size="18">Community cleanup mission</text>
  </svg>`
);

const demoState = {
  users: [
    { id: 'demo-kai', username: 'kai_cleans', display_name: 'kai_cleans', points: 1240, level: 3, streak: 12, missions_completed: 8, reports_submitted: 6 },
    { id: 'demo-priya', username: 'priya_eco', display_name: 'priya_eco', points: 890, level: 2, streak: 7, missions_completed: 5, reports_submitted: 4 },
    { id: 'demo-tnguyen', username: 'tnguyen', display_name: 'tnguyen', points: 640, level: 2, streak: 3, missions_completed: 4, reports_submitted: 3 }
  ],
  missions: []
};

function demoId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function demoAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}
function demoUser(id) {
  return demoState.users.find(user => user.id === id) || null;
}
function createDemoMission(location, description, status, creatorId, minutesAgo, acceptedBy) {
  const reportId = demoId('report');
  const mission = {
    id: demoId('mission'), report_id: reportId, status, verification_status: status === 'approved' ? 'approved' : null,
    created_at: demoAgo(minutesAgo), completed_at: status === 'approved' ? demoAgo(minutesAgo - 60) : null,
    points_reward: 150, accepted_by: acceptedBy || null, before_image: DEMO_IMAGE, after_image: null,
    report: { id: reportId, image_url: DEMO_IMAGE, location, description, created_at: demoAgo(minutesAgo), user_id: creatorId,
      reporter: demoUser(creatorId) },
    acceptor: acceptedBy ? demoUser(acceptedBy) : null
  };
  demoState.missions.push(mission);
}

[
  ['Sector 17 Park, near the east gate', 'Plastic bags and water bottles scattered near the park bench.', 'open', 'demo-kai', 14],
  ['MG Road footpath, outside Metro exit 3', 'Mixed waste including food containers and packaging.', 'in_progress', 'demo-priya', 60, 'demo-tnguyen'],
  ['Lajpat Nagar market, behind the vegetable stalls', 'Old crates, vegetable scraps, and plastic wrapping near the drain.', 'approved', 'demo-tnguyen', 180],
  ['Nehru Place parking lot B, northwest corner', 'A broken office chair and paper waste in the lot.', 'open', 'demo-priya', 28],
  ['Saket metro station bus stand', 'Fast-food wrappers and cups around the bus shelter.', 'open', 'demo-kai', 2]
].forEach(item => createDemoMission(...item));

function normalizeDemoMission(mission) {
  const statusMap = { in_progress: 'in-progress' };
  return {
    id: mission.id, st: statusMap[mission.status] || mission.status, ab: mission.accepted_by,
    at: mission.created_at, ct: mission.completed_at, points_reward: mission.points_reward,
    after_img: mission.after_image, rejection_reason: mission.rejection_reason || null,
    rpt: { id: mission.report.id, img: mission.report.image_url, loc: mission.report.location,
      desc: mission.report.description, by: mission.report.user_id, dist: null },
    creator: mission.report.reporter || {}, acceptor: mission.acceptor || null
  };
}

async function validateBeforeImage() {
  return { has_garbage: true, confidence: 1, skipped: true, reason: 'Demo mode' };
}

function _friendlyError(err, fallback) { return fallback || err?.message || 'Something went wrong.'; }

async function fileAsDataUrl(file) {
  if (!file) return DEMO_IMAGE;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file) {
  return fileAsDataUrl(file);
}

async function getOrCreateProfile(username) {
  const existing = demoState.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  if (existing) return existing;
  const profile = {
    id: demoId('user'), username, display_name: username, points: 0, level: 1,
    streak: 1, missions_completed: 0, reports_submitted: 0
  };
  demoState.users.push(profile);
  return profile;
}

async function getProfile(userId) {
  const profile = demoUser(userId);
  if (!profile) throw new Error('Demo profile not found.');
  return {
    ...profile,
    missions: demoState.missions
      .filter(mission => mission.accepted_by === userId)
      .map(mission => ({ id: mission.id, status: mission.status, created_at: mission.created_at, report: mission.report }))
  };
}

async function updateProfileLastActive() {}

async function createReport({ imageUrl, description, location, lat, lng, userId }) {
  const user = demoUser(userId);
  if (!user) throw new Error('Please enter your name again.');
  const reportId = demoId('report');
  const mission = {
    id: demoId('mission'), report_id: reportId, status: 'open', verification_status: null,
    created_at: new Date().toISOString(), completed_at: null, points_reward: 150,
    accepted_by: null, before_image: imageUrl || DEMO_IMAGE, after_image: null,
    report: { id: reportId, image_url: imageUrl || DEMO_IMAGE, location: location.trim(),
      description: (description || '').trim(), lat: lat || null, lng: lng || null,
      user_id: userId, reporter: user }
  };
  demoState.missions.unshift(mission);
  user.reports_submitted = (user.reports_submitted || 0) + 1;
  user.points = (user.points || 0) + 50;
  return { id: reportId, image_url: mission.report.image_url, location: mission.report.location };
}

async function getMissions(statusFilter) {
  const filter = statusFilter === 'in-progress' ? 'in_progress' : statusFilter;
  return demoState.missions
    .filter(mission => !filter || filter === 'all' || mission.status === filter)
    .map(normalizeDemoMission);
}

async function getMissionById(missionId) {
  const mission = demoState.missions.find(item => item.id === missionId);
  if (!mission) throw new Error('Mission not found.');
  return normalizeDemoMission(mission);
}

async function acceptMission(missionId, userId) {
  const mission = demoState.missions.find(item => item.id === missionId);
  if (!mission || mission.status !== 'open') throw new Error('already_accepted');
  mission.status = 'in_progress';
  mission.accepted_by = userId;
  mission.acceptor = demoUser(userId);
  return normalizeDemoMission(mission);
}

async function submitProof(missionId, afterImageFile, userId) {
  const mission = demoState.missions.find(item => item.id === missionId);
  if (!mission || mission.status !== 'in_progress') throw new Error('This mission is not available for proof.');
  if (mission.accepted_by !== userId) throw new Error('You can only submit proof for missions you accepted.');
  mission.after_image = await fileAsDataUrl(afterImageFile);
  mission.status = 'approved';
  mission.verification_status = 'approved';
  mission.completed_at = new Date().toISOString();
  const user = demoUser(userId);
  user.missions_completed = (user.missions_completed || 0) + 1;
  user.points = (user.points || 0) + mission.points_reward;
  return { ok: true, status: 'approved', pts: mission.points_reward };
}

async function getLeaderboard() {
  return [...demoState.users].sort((a, b) => b.points - a.points)
    .map(user => ({ username: user.username, points: user.points }));
}

async function deleteMission(missionId, userId) {
  const index = demoState.missions.findIndex(item => item.id === missionId);
  const mission = demoState.missions[index];
  if (!mission) throw new Error('Mission not found.');
  if (mission.report.user_id !== userId) throw new Error('Unauthorized: Only the uploader can delete this quest.');
  demoState.missions.splice(index, 1);
}

const _demoSubscriptions = new Map();
function subscribeReports(onInsert) { return { type: 'demo-reports', onInsert }; }
function subscribeMission(missionId, onChange) { const channel = { type: 'demo-mission', missionId, onChange }; _demoSubscriptions.set(missionId, channel); return channel; }
function subscribeLeaderboard(onChange) { return { type: 'demo-leaderboard', onChange }; }
function unsubscribe(channel) {
  if (channel?.missionId) _demoSubscriptions.delete(channel.missionId);
}
