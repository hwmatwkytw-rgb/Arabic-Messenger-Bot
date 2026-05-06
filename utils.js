function nowUptime() {
  const sec = Math.floor(process.uptime());
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `وقت التشغيل: ${h}س ${m}د ${s}ث`;
}

module.exports = { nowUptime };
