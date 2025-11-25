const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  technologies: { type: String },
  teamMembers: { type: String },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  metrics: {


    requirement: {
      total: { type: Number, default: 0 },
      reviewed: { type: Number, default: 0 },
      changedAfterApproval: { type: Number, default: 0 },
      unclear: { type: Number, default: 0 }
    },

    design: {
      totalComponents: { type: Number, default: 0 },
      reviewedComponents: { type: Number, default: 0 },
      defectiveComponents: { type: Number, default: 0 }
    },


    implementation: {
        n1: { type: Number, default: 0 },
        n2: { type: Number, default: 0 },
        N1: { type: Number, default: 0 },
        N2: { type: Number, default: 0 },

        bugs: { type: Number, default: 0 },
        codeQualityScore: { type: Number, default: 0 },
        commentsPercentage: { type: Number, default: 0 },
        duplicateCode: { type: Number, default: 0 },

        warnings: { type: Number, default: 0 },
        errors: { type: Number, default: 0 },
        cyclomaticComplexity: { type: Number, default: 0 },
        codingStandardViolations: { type: Number, default: 0 }
      },

    testing: {
      unit: {
        totalModules: { type: Number, default: 0 },
        modulesTested: { type: Number, default: 0 },
        modulesPassed: { type: Number, default: 0 },
        unitDefects: { type: Number, default: 0 }
      },
      integration: {
        integratedModules: { type: Number, default: 0 },
        integrationsTested: { type: Number, default: 0 },
        integrationsPassed: { type: Number, default: 0 },
        integrationDefects: { type: Number, default: 0 },
        interfaceFailures: { type: Number, default: 0 }
      },
      system: {
        functionalDefects: { type: Number, default: 0 },
        securityVulnerabilities: { type: Number, default: 0 },
        loadCapacity: { type: Number, default: 0 },
        maxConcurrentUsers: { type: Number, default: 0 },
        uptimePercentage: { type: Number, default: 0 },
        responseTime: { type: Number, default: 0 },
        performanceIssues: { type: Number, default: 0 }
      },
      uat: {
        alphaTestUsers: { type: Number, default: 0 },
        alphaIssues: { type: Number, default: 0 },
        betaTestUsers: { type: Number, default: 0 },
        betaIssues: { type: Number, default: 0 },
        clientApprovalScore: { type: Number, default: 0 }
      }
    },

    deployment: {
      bugsReported: { type: Number, default: 0 },
      bugsResolved: { type: Number, default: 0 },
      avgTimeToResolve: { type: Number, default: 0 }, 
      deploymentFailures: { type: Number, default: 0 },
      rollbackCount: { type: Number, default: 0 },
      downtimeHours: { type: Number, default: 0 },
      uptimePercentage: { type: Number, default: 0 },
      customerTickets: { type: Number, default: 0 },
      customerSatisfactionScore: { type: Number, default: 0 }
    }

  }

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
