/*
 * Copyright 2018 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import { cli, selectors } from '../../../../../../../tests/lib/ui'
import { wipe, waitTillNone } from '../../../../../../../tests/lib/k8s/wipe'
import { cli as kui, kubectlElectron, kuiElectron, CLI } from '../../../../../../../tests/lib/headless'

const doTests = (ctx: ISuite, impl: CLI) => {
  before(common.before(ctx, { noOpenWhisk: true, noApp: true }))
  after(common.after(ctx))

  it('should wipe k8s', () => {
    return wipe(ctx, kui)
  })

  it('should create sample pod from local file', () => {
    return kui.do('kubectl create -f ./data/k8s/pod.yaml', ctx.app)
      .then(kui.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  it('should list the new pod in electron', () => {
    return impl.do('kubectl get pods --ui', ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })
}

describe('k8s with electron via kui.js', function (this: ISuite) {
  doTests(this, kuiElectron)
})

describe('k8s with electron via kubectl kui', function (this: ISuite) {
  doTests(this, kubectlElectron)
})
