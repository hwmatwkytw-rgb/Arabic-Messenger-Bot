function hasPermission(userID, role, config) {
  const owners = Array.isArray(config.owners) ? config.owners : [];
  const admins = Array.isArray(config.admins) ? config.admins : [];

  if (role === 0) return true;                // للجميع
  if (role === 2) return owners.includes(userID); // للمالكين فقط
  // role === 1: مشرف أو مالك
  return owners.includes(userID) || admins.includes(userID);
}

module.exports = { hasPermission };
