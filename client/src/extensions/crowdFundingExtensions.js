import { readContract, resolveMethod } from "thirdweb"; // Importa resolveMethod
import { ethers } from "ethers";

// 🔹 Nueva función para obtener donadores y sus donaciones
export function getDonatorsCampaigns(options, campaignId) {
  console.log("Executing getDonatorsCampaigns with campaignId:", campaignId);
  return readContract({
    contract: options.contract,
    method: resolveMethod("getDonatorsCampaigns"),
    params: [campaignId],
  })
    .then((response) => {
      console.log("Raw donators data from contract:", response);
      if (!Array.isArray(response) || response.length !== 2) {
        console.warn("Donators data is not valid:", response);
        return { donators: [], donations: [] };
      }

      const [donators, donationsRaw] = response;

      // ✅ Convertir donaciones a números enteros
      const donations = donationsRaw.map((donation) =>
        Number((donation || 0n).toString())
      );

      return { donators, donations };
    })
    .catch((error) => {
      console.error("Error in getDonatorsCampaigns:", error);
      return { donators: [], donations: [] };
    });
}

// 🔹 Modificación de `getCrowdFundingCampaigns` para incluir donadores
export function getCrowdFundingCampaigns(options) {
  console.log("Executing getCrowdFundingCampaigns with options:", options);
  return readContract({
    contract: options.contract,
    method: resolveMethod("getCampaigns"),
  })
    .then(async (campaigns) => {
      console.log("Raw campaigns data from readContract:", campaigns);
      if (!Array.isArray(campaigns)) {
        console.warn("Campaigns data is not an array:", campaigns);
        return [];
      }

      // 🔹 Obtener campañas y sus donadores en paralelo
      const campaignData = await Promise.all(
        campaigns.map(async (campaign, index) => {
          try {
            const { donators, donations } = await getDonatorsCampaigns(
              options,
              index
            );

            return {
              pId: index, // 🔹 Agregamos pId basado en la posición

              tokenContract: campaign.tokenContract || "",
              owner: campaign.owner || "",
              title: campaign.title || "",
              description: campaign.description || "",
              location: campaign.location || "",
              target: Number((campaign.target || 0n).toString()),
              amountCollected: Number(
                (campaign.amountCollected || 0n).toString()
              ),
              deadline: Number((campaign.deadline || 0n).toString()),
              startDate: Number((campaign.startDate || 0n).toString()),
              image: campaign.image || "",
              donators, // ✅ Agregamos donadores obtenidos
              donations, // ✅ Agregamos donaciones obtenidas
              state:
                ["Active", "Completed", "Expired"][
                  Number(campaign.state) || 0
                ] || "Unknown",
              documents: Array.isArray(campaign.documents)
                ? campaign.documents
                : [],
              documentTitles: Array.isArray(campaign.documentTitles)
                ? campaign.documentTitles
                : [],
              video: campaign.video || "",
              tokenInfo: campaign.tokenInfo || "",
              tokenValueInEUR: ethers.utils.formatUnits(
                (campaign.tokenValueInEUR || 0n).toString(),
                6
              ),
            };
          } catch (error) {
            console.error("Error processing campaign:", error, campaign);
            return null;
          }
        })
      );

      return campaignData.filter(Boolean);
    })
    .catch((error) => {
      console.error("Error in getCrowdFundingCampaigns:", error);
      return [];
    });
}
