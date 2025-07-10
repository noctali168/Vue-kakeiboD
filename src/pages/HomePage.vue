<template>
  <div class="container">
    <Header />
    <CharacterSection />
    <Kuji />
    <SummaryArea />
    <NavCards />
    <Calender />
    <Reminder />
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import CharacterSection from '../components/CharacterSection.vue'
import SummaryArea from '../components/SummaryArea.vue'
import NavCards from '../components/NavCards.vue'
import Kuji from '../components/Kuji.vue'
import Reminder from '../components/Reminder.vue'
import Calender from '../components/Calender.vue'
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
