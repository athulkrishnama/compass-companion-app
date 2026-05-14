const configPlugins = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const { withAndroidManifest, withDangerousMod } = configPlugins;

const withNetworkSecurityConfig = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml"
      );
      const xmlPath = path.join(xmlDir, "network_security_config.xml");

      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        xmlPath,
        `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">localhost</domain>
    <domain includeSubdomains="false">127.0.0.1</domain>
    <domain includeSubdomains="false">10.0.2.2</domain>
  </domain-config>
</network-security-config>`
      );

      return config;
    },
  ]);
};

const withCleartextManifest = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$["android:networkSecurityConfig"] =
      "@xml/network_security_config";
    return config;
  });
};

const withAndroidCleartextLocalhost = (config) => {
  config = withNetworkSecurityConfig(config);
  config = withCleartextManifest(config);
  return config;
};

module.exports = withAndroidCleartextLocalhost;