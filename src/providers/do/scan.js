import { doGet } from "./client.js";

const TARGETS = {
  droplets: "/v2/droplets?per_page=200",
  volumes: "/v2/volumes?per_page=200",
  databases: "/v2/databases?per_page=200",
  kubernetes: "/v2/kubernetes/clusters?per_page=200",
  domains: "/v2/domains?per_page=200",
  loadbalancers: "/v2/load_balancers?per_page=200",
};

export async function runDoScan(token) {
  const entries = Object.entries(TARGETS);
  const settled = await Promise.allSettled(
    entries.map(([, path]) => doGet(token, path)),
  );

  const data = {};
  const errors = {};
  for (let index = 0; index < entries.length; index++) {
    const [key] = entries[index];
    const result = settled[index];
    if (result.status === "fulfilled") {
      data[key] = result.value;
      continue;
    }
    if (result.reason?.status === 401) {
      throw new Error("Invalid DigitalOcean token");
    }
    errors[key] = result.reason?.message || "Fetch failed";
  }

  const droplets = (data.droplets?.droplets || []).map((droplet) => ({
    id: droplet.id,
    name: droplet.name,
    status: droplet.status,
    region: droplet.region?.slug,
    size: droplet.size_slug,
    image: droplet.image?.slug || droplet.image?.name,
    vcpus: droplet.vcpus,
    memory_mb: droplet.memory,
    disk_gb: droplet.disk,
    public_ip:
      droplet.networks?.v4?.find((network) => network.type === "public")
        ?.ip_address || null,
    private_ip:
      droplet.networks?.v4?.find((network) => network.type === "private")
        ?.ip_address || null,
    tags: droplet.tags || [],
    created_at: droplet.created_at,
  }));

  const volumes = (data.volumes?.volumes || []).map((volume) => ({
    id: volume.id,
    name: volume.name,
    size_gb: volume.size_gigabytes,
    region: volume.region?.slug,
    droplet_ids: volume.droplet_ids || [],
    filesystem: volume.filesystem_type,
    created_at: volume.created_at,
  }));

  const databases = (data.databases?.databases || []).map((database) => ({
    id: database.id,
    name: database.name,
    engine: database.engine,
    version: database.version,
    region: database.region,
    status: database.status,
    size: database.size,
    nodes: database.num_nodes,
    created_at: database.created_at,
  }));

  const kubernetes = (data.kubernetes?.kubernetes_clusters || []).map(
    (cluster) => ({
      id: cluster.id,
      name: cluster.name,
      region: cluster.region,
      version: cluster.version,
      status: cluster.status?.state,
      node_pools: (cluster.node_pools || []).map((pool) => ({
        name: pool.name,
        size: pool.size,
        count: pool.count,
      })),
      created_at: cluster.created_at,
    }),
  );

  const domains = (data.domains?.domains || []).map((domain) => ({
    name: domain.name,
    ttl: domain.ttl,
  }));

  const loadbalancers = (data.loadbalancers?.load_balancers || []).map(
    (loadbalancer) => ({
      id: loadbalancer.id,
      name: loadbalancer.name,
      ip: loadbalancer.ip,
      status: loadbalancer.status,
      region: loadbalancer.region?.slug,
      created_at: loadbalancer.created_at,
    }),
  );

  const summary = {
    droplets: droplets.length,
    volumes: volumes.length,
    databases: databases.length,
    kubernetes_clusters: kubernetes.length,
    domains: domains.length,
    loadbalancers: loadbalancers.length,
  };
  summary.total_resources = Object.values(summary).reduce(
    (total, count) => total + count,
    0,
  );

  const result = {
    ok: Object.keys(errors).length === 0,
    scanned_at: new Date().toISOString(),
    summary,
    droplets,
    volumes,
    databases,
    kubernetes,
    domains,
    loadbalancers,
  };
  if (Object.keys(errors).length > 0) result.errors = errors;
  return result;
}
