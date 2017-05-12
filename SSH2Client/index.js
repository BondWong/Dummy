const net = require('net');
const BigInt = require('big-integer');

const version = 'SSH-2.0-JH_1.0\r\n';
const MIN = 1024;
const PREFERED = 1024;
const MAX = 8192;

const config = {
  kex: "diffie-hellman-group-exchange-sha256,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1",
  server_host_key: "ssh-rsa,ssh-dss,ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521",
  cipher_s2c: "aes128-ctr,aes128-cbc,3des-ctr,3des-cbc,blowfish-cbc,aes192-ctr,aes192-cbc,aes256-ctr,aes256-cbc",
  cipher_c2s: "aes128-ctr,aes128-cbc,3des-ctr,3des-cbc,blowfish-cbc,aes192-ctr,aes192-cbc,aes256-ctr,aes256-cbc",
  mac_s2c: "hmac-sha1,hmac-sha2-256,hmac-sha1-96,hmac-md5-96",
  mac_c2s: "hmac-sha1,hmac-sha2-256,hmac-sha1-96,hmac-md5-96",
  compression_s2c: "none",
  compression_c2s: "none",
  lang_s2c: "",
  lang_c2s: ""
}

const SSH_MSG_DISCONNECT = 1;
const SSH_MSG_IGNORE = 2;
const SSH_MSG_UNIMPLEMENTED = 3;
const SSH_MSG_DEBUG = 4;
const SSH_MSG_SERVICE_REQUEST = 5;
const SSH_MSG_SERVICE_ACCEPT = 6;
const SSH_MSG_KEXINIT = 20;
const SSH_MSG_NEWKEYS = 21;
const SSH_MSG_KEXDH_INIT = 30;
const SSH_MSG_KEXDH_REPLY = 31;
const SSH_MSG_KEX_DH_GEX_GROUP = 31;
const SSH_MSG_KEX_DH_GEX_INIT = 32;
const SSH_MSG_KEX_DH_GEX_REPLY = 33;
const SSH_MSG_KEX_DH_GEX_REQUEST = 34;
const SSH_MSG_GLOBAL_REQUEST = 80;
const SSH_MSG_REQUEST_SUCCESS = 81;
const SSH_MSG_REQUEST_FAILURE = 82;
const SSH_MSG_CHANNEL_OPEN = 90;
const SSH_MSG_CHANNEL_OPEN_CONFIRMATION = 91;
const SSH_MSG_CHANNEL_OPEN_FAILURE = 92;
const SSH_MSG_CHANNEL_WINDOW_ADJUST = 93;
const SSH_MSG_CHANNEL_DATA = 94;
const SSH_MSG_CHANNEL_EXTENDED_DATA = 95;
const SSH_MSG_CHANNEL_EOF = 96;
const SSH_MSG_CHANNEL_CLOSE = 97;
const SSH_MSG_CHANNEL_REQUEST = 98;
const SSH_MSG_CHANNEL_SUCCESS = 99;
const SSH_MSG_CHANNEL_FAILURE = 100;

const STEP = {
  VERSIONEXCHANGE: "VX",
  KEXINIT: "KI"
};
var status = [STEP.VERSIONEXCHANGE];

var client = new net.Socket();
client.connect(22, '45.33.70.244');

client.on('data', function(data) {
  if (status[0] === STEP.VERSIONEXCHANGE) {
    // exchange version
    console.log('Received: ' + data);
    var packet = version;
    console.log('Sent:' + packet);
    client.write(packet, function() {
      status[0] = STEP.KEXINIT;
    });
  } else if (status[0] === STEP.KEXINIT) {
    var msgCode = data.readUInt8(4 + 1);
    status[1] = msgCode;

    if (status[1] === SSH_MSG_KEXINIT) {
      var payload = Buffer.alloc(1);
      payload.writeUInt8(SSH_MSG_KEXINIT);
      var cookie = Buffer.from('E943B8EAD89BC6BD6861A54CFD333DB0', 'hex');
      payload = Buffer.concat([payload, cookie], payload.length + cookie.length);

      const kex = Buffer.from(config.kex);
      const kexLen = Buffer.alloc(4);
      kexLen.writeUInt32BE(config.kex.length);
      payload = Buffer.concat([payload, kexLen], 4 + payload.length);
      payload = Buffer.concat([payload, kex], kex.length + payload.length);

      const server_host_key = Buffer.from(config.server_host_key);
      const server_host_keyLen = Buffer.alloc(4);
      server_host_keyLen.writeUInt32BE(config.server_host_key.length);
      payload = Buffer.concat([payload, server_host_keyLen], 4 + payload.length);
      payload = Buffer.concat([payload, server_host_key], server_host_key.length + payload.length);

      const cipher_c2s = Buffer.from(config.cipher_c2s);
      const cipher_c2sLen = Buffer.alloc(4);
      cipher_c2sLen.writeUInt32BE(config.cipher_c2s.length);
      payload = Buffer.concat([payload, cipher_c2sLen], 4 + payload.length);
      payload = Buffer.concat([payload, cipher_c2s], cipher_c2s.length + payload.length);

      const cipher_s2c = Buffer.from(config.cipher_s2c);
      const cipher_s2cLen = Buffer.alloc(4);
      cipher_s2cLen.writeUInt32BE(config.cipher_s2c.length);
      payload = Buffer.concat([payload, cipher_s2cLen], 4 + payload.length);
      payload = Buffer.concat([payload, cipher_s2c], cipher_s2c.length + payload.length);

      const mac_c2s = Buffer.from(config.mac_c2s);
      const mac_c2sLen = Buffer.alloc(4);
      mac_c2sLen.writeUInt32BE(config.mac_c2s.length);
      payload = Buffer.concat([payload, mac_c2sLen], 4 + payload.length);
      payload = Buffer.concat([payload, mac_c2s], mac_c2s.length + payload.length);

      const mac_s2c = Buffer.from(config.mac_s2c);
      const mac_s2cLen = Buffer.alloc(4);
      mac_s2cLen.writeUInt32BE(config.mac_s2c.length);
      payload = Buffer.concat([payload, mac_s2cLen], 4 + payload.length);
      payload = Buffer.concat([payload, mac_s2c], mac_s2c.length + payload.length);

      const compression_c2s = Buffer.from(config.compression_c2s);
      const compression_c2sLen = Buffer.alloc(4);
      compression_c2sLen.writeUInt32BE(config.compression_c2s.length);
      payload = Buffer.concat([payload, compression_c2sLen], 4 + payload.length);
      payload = Buffer.concat([payload, compression_c2s], compression_c2s.length + payload.length);

      const compression_s2c = Buffer.from(config.compression_s2c);
      const compression_s2cLen = Buffer.alloc(4);
      compression_s2cLen.writeUInt32BE(config.compression_s2c.length);
      payload = Buffer.concat([payload, compression_s2cLen], 4 + payload.length);
      payload = Buffer.concat([payload, compression_s2c], compression_s2c.length + payload.length);

      const lang_c2s = Buffer.from(config.lang_c2s);
      const lang_c2sLen = Buffer.alloc(4);
      lang_c2sLen.writeUInt32BE(config.lang_c2s.length);
      payload = Buffer.concat([payload, lang_c2sLen], 4 + payload.length);
      payload = Buffer.concat([payload, lang_c2s], lang_c2s.length + payload.length);

      const lang_s2c = Buffer.from(config.lang_s2c);
      const lang_s2cLen = Buffer.alloc(4);
      lang_s2cLen.writeUInt32BE(config.lang_s2c.length);
      payload = Buffer.concat([payload, lang_s2cLen], 4 + payload.length);
      payload = Buffer.concat([payload, lang_s2c], lang_s2c.length + payload.length);

      var temp = Buffer.alloc(1);
      temp.writeUInt8(0);
      payload = Buffer.concat([payload, temp], temp.length + payload.length);
      var temp = Buffer.alloc(4);
      temp.writeUInt32BE(0);
      payload = Buffer.concat([payload, temp], temp.length + payload.length);

      var padding = getPadding(payload.length + 5, 8);
      var pad = Buffer.alloc(padding);
      pad.fill(0);
      var packet = Buffer.alloc(5);
      packet.writeUInt32BE(payload.length + padding + 1);
      packet.writeUInt8(padding, 4);
      packet = Buffer.concat([packet, payload], packet.length + payload.length);
      packet = Buffer.concat([packet, pad], packet.length + pad.length);

      client.write(packet, function() {
        var payload = Buffer.alloc(1);
        payload.writeUInt8(SSH_MSG_KEX_DH_GEX_REQUEST);
        var min = Buffer.alloc(4);
        min.writeUInt32BE(MIN);
        var n = Buffer.alloc(4);
        n.writeUInt32BE(PREFERED);
        var max = Buffer.alloc(4);
        max.writeUInt32BE(MAX);
        payload = Buffer.concat([payload, min, n, max], payload.length + min.length + n.length + max.length);

        var padding = getPadding(payload.length + 5, 8);
        var pad = Buffer.alloc(padding);
        pad.fill(0);
        var packet = Buffer.alloc(5);
        packet.writeUInt32BE(payload.length + padding + 1);
        packet.writeUInt8(padding, 4);
        packet = Buffer.concat([packet, payload], packet.length + payload.length);
        packet = Buffer.concat([packet, pad], packet.length + pad.length);

        client.write(packet);
      });
    } else if (status[1] === SSH_MSG_KEX_DH_GEX_GROUP) {
      var packetLength = data.readUInt32BE();
      var padding = data.readUInt8(4);
      var payloadLength = packetLength - padding - 1;

      var pLen = data.readUInt32BE(4 + 1 + 1);
      var p = data.slice(4 + 1 + 1 + 4, 4 + 1 + 1 + 4 + pLen).toString('hex');
      p = BigInt(p, 16);

      var gLen = data.readUInt32BE(4 + 1 + 1 + 4 + pLen);
      var g = data.slice(4 + 1 + 1 + 4 + pLen, 4 + 1 + 1 + 4 + pLen + gLen).toString('hex');
      g = BigInt(g, 16);
      g = g.isZero() ? BigInt('2', 16) : g;

      var x = BigInt.randBetween(1, (p.minus(1)).divide(2));
      var e = g.modPow(x, p);

      var payload = Buffer.alloc(1);
      payload.writeUInt8(SSH_MSG_KEX_DH_GEX_INIT);
      e = e.toString(16);
      e = Buffer.from(e, 'hex');
      const eLen = Buffer.alloc(4);
      eLen.writeUInt32BE(e.length);
      payload = Buffer.concat([payload, eLen], 4 + payload.length);
      payload = Buffer.concat([payload, e], payload.length + e.length);

      var padding = getPadding(payload.length + 5, 8);
      var pad = Buffer.alloc(padding);
      pad.fill(0);
      var packet = Buffer.alloc(5);
      packet.writeUInt32BE(payload.length + padding + 1);
      packet.writeUInt8(padding, 4);
      packet = Buffer.concat([packet, payload], packet.length + payload.length);
      packet = Buffer.concat([packet, pad], packet.length + pad.length);

      client.write(packet);
    } else if (status[1] === SSH_MSG_KEX_DH_GEX_REPLY) {
      var packetLength = data.readUInt32BE();
      var padding = data.readUInt8(4);
      var payloadLength = packetLength - padding - 1;
      var K_SLen = data.readUInt32BE(4 + 1 + 1);
      var K_S = data.slice(4 + 1 + 1 + 4, 4 + 1 + 1 + 4 + K_SLen).toString('hex');
      if (!check(K_S)) {
        client.close();
      }

      var fLen = data.readUInt32BE(4 + 1 + 1 + 4 + K_SLen);
      var f = data.slice(4 + 1 + 1 + 4 + K_SLen + 4, 4 + 1 + 1 + 4 + K_SLen + 4 + fLen).toString('hex');
      f = BigInt(f, 16);

      var sigLen = data.readUInt32BE(4 + 1 + 1 + 4 + K_SLen + 4 + fLen);
      var sig = data.slice(4 + 1 + 1 + 4 + K_SLen + 4 + fLen + 4, 4 + 1 + 1 + 4 + K_SLen + 4 + fLen + 4 + sigLen).toString('hex');

      // calculate K and H
      var K;
      var H;
      if (verify(sig, H)) {
        var payload = Buffer.alloc(1);
        payload.writeUInt8(SSH_MSG_NEWKEYS);
        var padding = getPadding(payload.length + 5, 8);
        var pad = Buffer.alloc(padding);
        pad.fill(0);
        var packet = Buffer.alloc(5);
        packet.writeUInt32BE(payload.length + padding + 1);
        packet.writeUInt8(padding, 4);
        packet = Buffer.concat([packet, payload], packet.length + payload.length);
        packet = Buffer.concat([packet, pad], packet.length + pad.length);

        client.write(packet, function() {
          // done! drop connection
          client.end();
        });
      }
    }
  }
});

client.on('close', function() {
  console.log('Connection closed');
});

function getPadding(length, blockSize) {
  var cnt = length / blockSize;
  cnt = Math.ceil(cnt);
  var padding = cnt * blockSize - length;
  padding = padding < 4 ? 4 : padding;
  if (length + padding < 16) {
    padding = 16 - length;
  }
  return padding;
}

function check(K_S) {
  return true;
}

function verify(sig, H) {
  return true;
}
