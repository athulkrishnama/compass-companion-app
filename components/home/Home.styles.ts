import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  // Header
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoText: { fontSize: 20, fontWeight: "800", color: "#111", letterSpacing: -0.3 },
  logoutBtn: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  // Scroll
  scroll: { padding: 20, paddingBottom: 48, gap: 14 },

  // Welcome
  welcomeRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 4 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: { fontSize: 20, fontWeight: "800", color: "#fff" },
  welcomeSub: { fontSize: 11, color: "#888", fontWeight: "500" },
  welcomeName: { fontSize: 20, fontWeight: "800", color: "#111" },

  // Card (shared)
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },

  // Status card (Horizontal Premium Design)
  statusCardRow: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statusHelper: {
    fontSize: 11,
    color: "#9ca3af",
  },
  toggleBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleTextSmall: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // Vehicle card header
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardHeadLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111" },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: "#f1f1f1", marginHorizontal: -20, marginBottom: 14 },
  cardBody: { gap: 12 },

  // Center states
  centerBlock: { alignItems: "center", paddingVertical: 28, gap: 10 },
  mutedText: { fontSize: 13, color: "#aaa", textAlign: "center" },
  retryBtn: {
    marginTop: 4,
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 12,
  },
  retryText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // Image
  vehicleImg: { width: 190, height: 118, borderRadius: 14 },

  // Info rows
  chipRow: { flexDirection: "row", gap: 10 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 14,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#ebebeb",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, fontWeight: "700", color: "#111" },

  // Chips
  chip: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  chipIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#ebebeb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  chipValue: { fontSize: 15, fontWeight: "800", color: "#111" },
});
