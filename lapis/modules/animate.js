async function animateVaildate(packet, dbAccount, client) {
  if ((packet.action_id !== "row_left" && packet.action_id !== "row_right") && typeof packet.boat_rowing_time === 'number') {
    console.log(`[${dbAccount.xuid}] sent a bad animate packet. [T1]`);
    if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invaild animate information sent. [T1] `, 0);
  }

  if (packet.action_id === "unknown" || packet.action_id === "none") {
    console.log(`[${dbAccount.xuid}] sent a bad animate packet. [T2]`);
    if (!config.debug) client.sendCommand(`kick "${dbAccount.xuid}" Invaild animate information sent. [T2] `, 0);
  }
}

module.exports = {
  animateVaildate: animateVaildate
};