<!--
Copyright (c) 2008,2020 Silicon Labs.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<template>
  <div>
    <div class="row q-py-md">
      <strong>
        <q-breadcrumbs>
          <!-- this needs to be updated depending on how the pages will work -->
          <q-breadcrumbs-el icon="keyboard_arrow_left" to="/">
            Endpoint {{ this.endpointId[this.selectedEndpointId] }}
          </q-breadcrumbs-el>
          <q-breadcrumbs-el to="/">
            {{ selectedCluster.domainName }}
          </q-breadcrumbs-el>
          <q-breadcrumbs-el to="/">{{
            selectedCluster.label
          }}</q-breadcrumbs-el>
        </q-breadcrumbs>
      </strong>
    </div>

    <h5 style="margin: 10px 0 0px">
      <strong>
        {{ selectedCluster.label }}
      </strong>
    </h5>
    <div class="row q-py-none">
      <div>
        Cluster ID: {{ asHex(selectedCluster.code, 4) }}, Enabled for
        <strong> {{ enabledMessage }} </strong>
      </div>
      <q-space />
      <q-input
        dense
        outlined
        clearable
        :placeholder="placeHolderText"
        @input="setIndividualClusterFilterString($event)"
        @clear="setIndividualClusterFilterString('')"
        :value="individualClusterFilterString"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="q-pb-sm">
      <q-tabs v-model="tab" dense active-color="blue" align="left">
        <q-tab name="attributes" label="Attributes" />
        <q-tab name="reporting" label="Attribute Reporting" />
        <q-tab name="commands" label="Commands" />
      </q-tabs>

      <q-separator />
      <div v-show="Object.keys(selectedCluster).length > 0">
        <div class="col" v-show="tab == 'attributes'">
          <ZclAttributeManager />
        </div>
        <div class="col" v-show="tab == 'commands'">
          <ZclCommandManager />
        </div>
        <div class="col" v-show="tab == 'reporting'">
          <ZclAttributeReportingManager />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ZclAttributeManager from './ZclAttributeManager.vue'
import ZclAttributeReportingManager from './ZclAttributeReportingManager.vue'
import ZclCommandManager from './ZclCommandManager.vue'
import EditableAttributesMixin from '../util/editable-attributes-mixin'

export default {
  name: 'ZclClusterView',
  mixins: [EditableAttributesMixin],
  computed: {
    enabledMessage: {
      get() {
        if (
          this.selectionClients.includes(this.selectedClusterId) &&
          this.selectionServers.includes(this.selectedClusterId)
        )
          return ' Client & Server'
        if (this.selectionServers.includes(this.selectedClusterId))
          return ' Server'
        if (this.selectionClients.includes(this.selectedClusterId))
          return ' Client'
        return ' none'
      },
    },
    placeHolderText: {
      get() {
        return 'Search ' + this.tab
      },
    },
    individualClusterFilterString: {
      get() {
        return this.$store.state.zap.clusterManager
          .individualClusterFilterString
      },
    },
  },
  methods: {
    setIndividualClusterFilterString(filterString) {
      this.$store.dispatch('zap/setIndividualClusterFilterString', filterString)
    },
  },
  data() {
    return {
      tab: 'attributes',
    }
  },

  components: {
    ZclCommandManager,
    ZclAttributeManager,
    ZclAttributeReportingManager,
  },
}
</script>
