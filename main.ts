import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

import { Service, IntOrString, Deployment  } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    const label = { app: 'hello-k8s' };

    new Service(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    });

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: 'paulbouwer/hello-kubernetes:1.8',
                ports: [ { containerPort: 8080 } ],
                env: [{
                    name: "MESSAGE",
                    value: "I just deployed this on Kubernetes using CDK for Kubernetes"

                }]
              }
            ]
          }
        }
      }
    });

  }
}

const app = new App();
new MyChart(app, 'kubHello');
app.synth();
