<script lang="ts">
  import Button from '$lib/components/Button/index.svelte';
  import Heading from '$lib/components/Heading/index.svelte';
  import Input from '$lib/components/Input/index.svelte';
  import Text from '$lib/components/Text/index.svelte';
  import {
    addStageToFarmCompare,
    removeStageToFarmCompare,
    stage as stageStore,
  } from '$lib/shared/stores/user/stage';
  import { sprinkles } from '$lib/styles/sprinkles.css';
  import * as tableStyles from '$lib/styles/table.css';
  import { theme } from '$lib/styles/themes/index.css';
  import { getRowStyling } from '$lib/styles/utils';
  import { getIdleKingdomNumberFormat } from '$lib/utils';
  import { calculateStageRewardByType, returnRewardDataByStage } from '$lib/utils/stage';
  import { nanoid } from 'nanoid';
  import * as R from 'remeda';
  import Icon from 'svelte-icons-pack';
  import RiDeviceSave2Fill from 'svelte-icons-pack/ri/RiDeviceSave2Fill';
  import RiSystemDeleteBinFill from 'svelte-icons-pack/ri/RiSystemDeleteBinFill';

  import * as styles from './index.css';

  let stage;
  let seconds;
  let totalTimeFarmingInHours = '12';

  let stages = [];

  let processedStages = [];

  const addStageToCompare = () => {
    if (!stage || !seconds) return;
    addStageToFarmCompare({
      id: nanoid(),
      stage: +stage,
      seconds: +seconds,
    });
    stage = '';
    seconds = '';
  };

  const processStages = () => {
    const processedStagesBoforeOrdering = stages.map((stage) => {
      const stageRewardsData = returnRewardDataByStage(stage.stage);
      // add gold and soulstone as rewards to make it easier to do the calculations
      stageRewardsData.idle.itemRates.push({
        type: 27,
        rate: 1,
      });
      stageRewardsData.idle.itemRates.push({
        type: 102,
        rate: 1,
      });
      const rewardsPerHour = stageRewardsData.idle.itemRates.reduce((acc, itemRate) => {
        const calculatedReward = calculateStageRewardByType(
          itemRate,
          stage.stage,
          stageRewardsData.idle
        );
        if (!calculatedReward) return acc;
        acc[itemRate.type] = Math.floor(
          Math.floor(calculatedReward) * Math.floor(3600 / stage.seconds) * itemRate.rate
        );
        return acc;
      }, {});

      const rewardsPerSpecifiedTime = stageRewardsData.idle.itemRates.reduce((acc, itemRate) => {
        const calculatedReward = calculateStageRewardByType(
          itemRate,
          stage.stage,
          stageRewardsData.idle
        );
        if (!calculatedReward) return acc;
        acc[itemRate.type] = Math.floor(
          Math.floor(calculatedReward) *
            Math.floor((3600 * +totalTimeFarmingInHours) / stage.seconds) *
            itemRate.rate
        );
        return acc;
      }, {});

      return {
        id: stage.id,
        stage: stage.stage,
        seconds: stage.seconds,
        rewardsPerHour,
        rewardsPerSpecifiedTime,
      };
    });

    processedStages = R.sortBy(
      processedStagesBoforeOrdering,
      [(x) => x.rewardsPerHour[24], 'desc'],
      [(x) => x.rewardsPerHour[31], 'desc'],
      (x) => x.id
    );
  };

  stageStore.subscribe((stageStoreData) => {
    stages = stageStoreData?.stageFarmCompare ?? [];
  });

  $: (stages || totalTimeFarmingInHours) && processStages();
</script>

<div class={styles.bulkEditForm}>
  <Input
    textAlign="center"
    label="Total time farming per day (hour)"
    bind:value={totalTimeFarmingInHours}
    maskOptions={{
      mask: Number,
      min: 1,
      max: 24,
    }}
  />
</div>
<div class={styles.bulkEditForm}>
  <Input
    textAlign="center"
    label="Stage"
    bind:value={stage}
    maskOptions={{
      mask: Number,
    }}
  />
  <Input
    textAlign="center"
    label="Time to finish (seconds)"
    bind:value={seconds}
    maskOptions={{
      mask: /^[0-9]*(\.[0-9]*)?$/,
    }}
  />
  <Button variant="success" on:click={addStageToCompare}>
    <Icon className={styles.buttonIcon} src={RiDeviceSave2Fill} color={theme.colors.white} />
  </Button>
</div>
<div class={styles.table}>
  <div class={tableStyles.tableRow}>
    <div class={[styles.tableHeader, styles.stickyLeft, sprinkles({ paddingX: 4 })].join(' ')}>
      <Heading textAlign="center">Stage</Heading>
    </div>
    <div class={styles.tableHeader}>
      <Heading textAlign="center">Time To Finish</Heading>
    </div>
    <div class={styles.tableHeader}>
      <img
        class={styles.icon}
        src="images/icons/iconEvolveStone.png"
        alt="Ascension Stone Icon"
      /><Heading textAlign="center">/h</Heading>
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconSoul.png" alt="Soulstone Icon" /><Heading
        textAlign="center">/h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img
        class={styles.icon}
        src="images/icons/iconScrollSanctuary.png"
        alt="Hero Seal Icon"
      /><Heading textAlign="center">/h</Heading>
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconScrollHero.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconScrollRune.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconGold.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img
        class={styles.icon}
        src="images/icons/iconEvolveStone.png"
        alt="Ascension Stone Icon"
      /><Heading textAlign="center">/{totalTimeFarmingInHours}h</Heading>
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconSoul.png" alt="Ascension Stone Icon" /><Heading
        textAlign="center">/{totalTimeFarmingInHours}h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img
        class={styles.icon}
        src="images/icons/iconScrollSanctuary.png"
        alt="Hero Seal Icon"
      /><Heading textAlign="center">/{totalTimeFarmingInHours}h</Heading>
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconScrollHero.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/{totalTimeFarmingInHours}h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconScrollRune.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/{totalTimeFarmingInHours}h</Heading
      >
    </div>
    <div class={styles.tableHeader}>
      <img class={styles.icon} src="images/icons/iconGold.png" alt="Hero Seal Icon" /><Heading
        textAlign="center">/{totalTimeFarmingInHours}h</Heading
      >
    </div>
    <div />
    {#each processedStages as pStage, i}
      <div class={tableStyles.tableRowVariant[getRowStyling(i)]}>
        <div class={[tableStyles.tableItem, styles.stickyLeft].join(' ')}>
          <Text>{pStage.stage}</Text>
        </div>
        <div class={tableStyles.tableItem}>
          <Text>{pStage.seconds}</Text>
        </div>
        {#each Object.keys(pStage.rewardsPerHour) as reward}
          <div class={tableStyles.tableItem}>
            <Text>{getIdleKingdomNumberFormat(pStage.rewardsPerHour[reward])}</Text>
          </div>
        {/each}
        {#each Object.keys(pStage.rewardsPerSpecifiedTime) as reward}
          <div class={tableStyles.tableItem}>
            <Text>{getIdleKingdomNumberFormat(pStage.rewardsPerSpecifiedTime[reward])}</Text>
          </div>
        {/each}
        <div class={[tableStyles.tableItem, styles.stickyRight].join(' ')}>
          <Button variant="danger" on:click={() => removeStageToFarmCompare(pStage.id)}>
            <Icon
              className={styles.buttonIcon}
              src={RiSystemDeleteBinFill}
              color={theme.colors.white}
            />
          </Button>
        </div>
      </div>
    {/each}
  </div>
</div>
