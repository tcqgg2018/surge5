(async () => {
  try {
    const paths = [
      "/v1/features/mitm", 
      "/v1/features/rewrite", 
      "/v1/features/scripting", 
      "/v1/profiles/current", 
      "/v1/outbound", 
      "/v1/modules"
    ];
    
    const [mitm, rewrite, script, profile, outbound, modules] = await Promise.all(
      paths.map((path) => httpAPI(path))
    );

    const content = [
      `MitM: ${mitm.enabled ? '✅ 已启用' : '❌ 未启用'}`,
      `Rewrite: ${rewrite.enabled ? '✅ 已启用' : '❌ 未启用'}`,
      `Scripting: ${script.enabled ? '✅ 已启用' : '❌ 未启用'}`,
      `Modules: ${modules.enabled ? '✅ 已启用' : '❌ 未启用'}`,
      `Outbound 模式: ${outbound.mode}`,
      `当前环境: ${JSON.stringify($environment)}`,
      `Hostname 匹配: ${profile.profile.match(/hostname\s?=.*/)?.[0] || '无'}`,
      `Hostname-规则: ${profile.profile.match(/hostname-.*/)?.[0] || '无'}`
    ].join('\n');

    $done({
      title: "Surge 配置状态",
      content,
      icon: "network",
      "icon-color": "#5AC8FA"
    });

  } catch (e) {
    console.log(e);
    $done({
      title: "Surge 配置状态",
      content: "❌ 获取信息失败，请检查脚本或网络状态。",
      icon: "exclamationmark.triangle",
      "icon-color": "#FF9500"
    });
  }
})();

function httpAPI(path = "", method = "GET", body = null) {
  return new Promise((resolve) => {
    $httpAPI(method, path, body, (result) => {
      resolve(result);
    });
  });
}