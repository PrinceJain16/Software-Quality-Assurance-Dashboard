import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import api from '../services/api';


import html2canvas from 'html2canvas'; 
import jsPDF from 'jspdf';

import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#FF8A33', '#8333FF'];
const LIGHT_BLUE = '#36A2EB';
const DARK_PURPLE = '#5c14eb';
const RED_VOLATILITY = '#FF6384';
const ORANGE_DEFECT = '#ffb84d';


const calculateHalsteadMetrics = (impl) => {
    const n1 = impl.n1 || 0;
    const n2 = impl.n2 || 0;
    const N1 = impl.N1 || 0;
    const N2 = impl.N2 || 0;

    const vocabulary = n1 + n2;
    const length = N1 + N2;
    const volume = vocabulary > 1 ? length * Math.log2(vocabulary) : 0;
    const difficulty = n2 > 0 ? (n1 / 2) * (N2 / n2) : 0;
    const effort = volume * difficulty;

    return {
      vocabulary: vocabulary.toFixed(0),
      length: length.toFixed(0),
      volume: volume.toFixed(0),
      difficulty: difficulty.toFixed(2),
      effort: effort.toFixed(0)
    };
};

export default function ProjectDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false); 
  const dashboardRef = useRef(null); 

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const metrics = project?.metrics || {};

  const dashboardData = useMemo(() => {
    if (!project) return {};


    const req = metrics.requirement || {};
    const totalReq = req.total || 0;
    const reviewedReq = req.reviewed || 0;
    const changedReq = req.changedAfterApproval || 0;
    const unclearReq = req.unclear || 0;

    const volatilityPercent = totalReq > 0 ? ((changedReq / totalReq) * 100).toFixed(2) : 0;
    const ambiguityPercent = totalReq > 0 ? ((unclearReq / totalReq) * 100).toFixed(2) : 0;
    const reviewCoverage = totalReq > 0 ? ((reviewedReq / totalReq) * 100).toFixed(0) : 0;

    const reqPieData = [
      { name: `Reviewed (${reviewCoverage}%)`, value: reviewedReq, color: LIGHT_BLUE },
      { name: `Unclear (${ambiguityPercent}%)`, value: unclearReq, color: COLORS[2] },
      { name: `Changed (${volatilityPercent}%)`, value: changedReq, color: RED_VOLATILITY },
    ].filter(x => x.value > 0);

   
    const design = metrics.design || {};
    const totalComponents = design.totalComponents || 0;
    const defectiveComponents = design.defectiveComponents || 0;

    const defectDensity =
      totalComponents > 0
        ? ((defectiveComponents / totalComponents) * 100).toFixed(2)
        : 0;

   
    const impl = metrics.implementation || {};
    const halstead = calculateHalsteadMetrics(impl);

    const codeDefectData = [
      { name: 'Bugs', value: impl.bugs || 0, color: RED_VOLATILITY },
      { name: 'Warnings', value: impl.warnings || 0, color: COLORS[2] },
      { name: 'Errors', value: impl.errors || 0, color: ORANGE_DEFECT },
    ].filter(x => x.value > 0);

    const commentsPercent = impl.commentsPercentage || 0;

    
    const testing = metrics.testing || {};
    const unit = testing.unit || {};
    const integration = testing.integration || {};
    const system = testing.system || {};
    const uat = testing.uat || {};

    const unitCoverage =
      unit.totalModules > 0
        ? ((unit.modulesTested / unit.totalModules) * 100).toFixed(0)
        : 0;

    const totalDefectsFound =
      (unit.unitDefects || 0) +
      (integration.integrationDefects || 0) +
      (system.functionalDefects || 0);

    const defectDistribution = [
      { name: 'Unit Defects', value: unit.unitDefects || 0, color: COLORS[1] },
      { name: 'Integration Defects', value: integration.integrationDefects || 0, color: COLORS[2] },
      { name: 'Functional Defects', value: system.functionalDefects || 0, color: COLORS[4] },
    ].filter(x => x.value > 0);

    const testSuccessData = [
      {
        name: 'Unit Success %',
        value:
          unit.modulesTested > 0
            ? ((unit.modulesPassed / unit.modulesTested) * 100).toFixed(0)
            : 0
      },
      {
        name: 'Integration Success %',
        value:
          integration.integrationsTested > 0
            ? ((integration.integrationsPassed / integration.integrationsTested) * 100).toFixed(0)
            : 0
      },
      { name: 'UAT Approval (1-10)', value: uat.clientApprovalScore || 0 },
    ];

    const deploy = metrics.deployment || {};

    const bugsResolvedPercent =
      deploy.bugsReported > 0
        ? ((deploy.bugsResolved / deploy.bugsReported) * 100).toFixed(0)
        : 0;

    const stabilityData = [
      { name: 'Deployment Failures', value: deploy.deploymentFailures || 0, color: RED_VOLATILITY },
      { name: 'Rollbacks', value: deploy.rollbackCount || 0, color: ORANGE_DEFECT },
    ].filter(x => x.value > 0);

    const customerData = [
      { name: 'CSAT (1-10)', value: deploy.customerSatisfactionScore || 0, color: DARK_PURPLE },
      { name: 'Downtime (Hrs)', value: deploy.downtimeHours || 0, color: RED_VOLATILITY },
      { name: 'Uptime (%)', value: deploy.uptimePercentage || 0, color: LIGHT_BLUE },
    ];

    return {
      reqPieData, volatilityPercent, ambiguityPercent, reviewCoverage,
      halstead, codeDefectData, commentsPercent,
      designDefectDensity: defectDensity,
      unitCoverage, totalDefectsFound, defectDistribution, testSuccessData,
      bugsResolvedPercent, stabilityData, customerData,
      design, impl, testing, deploy
    };
  }, [project]);

  const calculateQuality = () => {
    if (!project) return 0;

    try {
      const reqQ =
        (dashboardData.reviewCoverage / 100 +
          (1 - dashboardData.ambiguityPercent / 100) +
          (1 - dashboardData.volatilityPercent / 100)) /
        3;

      const designQ = 1 - dashboardData.designDefectDensity / 100;

      const implQ =
        ((dashboardData.impl?.codeQualityScore || 0) / 10 +
          (1 - (dashboardData.impl?.cyclomaticComplexity || 0) / 20)) /
        2;

      const testQ =
        (dashboardData.unitCoverage / 100 +
          (1 - dashboardData.totalDefectsFound / 50)) /
        2;

      const deployQ =
        ((dashboardData.deploy?.uptimePercentage || 0) / 100 +
          ((dashboardData.deploy?.customerSatisfactionScore || 0) / 10)) /
        2;

      const clamp = (v) => Math.max(0, Math.min(1, v));

      const score =
        (clamp(reqQ) +
          clamp(designQ) +
          clamp(implQ) +
          clamp(testQ) +
          clamp(deployQ)) /
        5;

      return Math.round(score * 100);
    } catch {
      return 0;
    }
  };

  const qualityPercent = calculateQuality();
  const getPhaseQualityScores = () => {
  if (!project) return [];

  const safe = (v) => Number(v || 0);

  const reqQ =
    (safe(dashboardData.reviewCoverage) / 100 +
      (1 - safe(dashboardData.ambiguityPercent) / 100) +
      (1 - safe(dashboardData.volatilityPercent) / 100)) /
    3;

  const designQ = 1 - safe(dashboardData.designDefectDensity) / 100;

  const implQ =
    ((safe(dashboardData.impl?.codeQualityScore) / 10) +
      (1 - safe(dashboardData.impl?.cyclomaticComplexity) / 20)) /
    2;

  const testQ =
    (safe(dashboardData.unitCoverage) / 100 +
      (1 - safe(dashboardData.totalDefectsFound) / 50)) /
    2;

  const deployQ =
    ((safe(dashboardData.deploy?.uptimePercentage) / 100) +
      (safe(dashboardData.deploy?.customerSatisfactionScore) / 10)) /
    2;

  return [
    { name: "Requirements", score: Math.round(reqQ * 100) },
    { name: "Design", score: Math.round(designQ * 100) },
    { name: "Implementation", score: Math.round(implQ * 100) },
    { name: "Testing", score: Math.round(testQ * 100) },
    { name: "Deployment", score: Math.round(deployQ * 100) },
  ];
};
const phaseScores = getPhaseQualityScores();

 const generateDetailedQualityFeedback = () => {
  const issues = [];
  const positives = [];

  // Extract all values safely (NO crashes)
  const review = Number(dashboardData?.reviewCoverage ?? 0);
  const volatility = Number(dashboardData?.volatilityPercent ?? 0);
  const ambiguity = Number(dashboardData?.ambiguityPercent ?? 0);

  const defectDensity = Number(dashboardData?.designDefectDensity ?? 0);
  const totalComponents = Number(dashboardData?.design?.totalComponents ?? 0);
  const reviewedComponents = Number(dashboardData?.design?.reviewedComponents ?? 0);

  const implQuality = Number(dashboardData?.impl?.codeQualityScore ?? 0);
  const implComplexity = Number(dashboardData?.impl?.cyclomaticComplexity ?? 0);
  const implComments = Number(dashboardData?.commentsPercent ?? 0);

  const unitCoverage = Number(dashboardData?.unitCoverage ?? 0);
  const totalDefects = Number(dashboardData?.totalDefectsFound ?? 0);

  const uptime = Number(dashboardData?.deploy?.uptimePercentage ?? 0);
  const csat = Number(dashboardData?.deploy?.customerSatisfactionScore ?? 0);
  const avgResolveTime = Number(dashboardData?.deploy?.avgTimeToResolve ?? 0);
  const bugFixRate = Number(dashboardData?.bugsResolvedPercent ?? 0);


  if (review < 70)
    issues.push(`Requirements review coverage is low (${review}%). This raises the risk of misalignment and missed acceptance criteria.`);
  else
    positives.push(`Strong review coverage (${review}%). Requirements are being validated effectively.`);

  if (volatility > 20)
    issues.push(`Requirement volatility is high (${volatility}%). Frequent post-approval changes suggest instability or unclear initial objectives.`);
  else
    positives.push(`Stable requirement set with low volatility (${volatility}%). Changes appear well-controlled.`);

  if (ambiguity > 10)
    issues.push(`Unclear requirements are high (${ambiguity}%). This increases downstream design & testing confusion.`);
  else
    positives.push(`Low ambiguity in requirement definitions (${ambiguity}%). Reduces design and test misunderstandings.`);


  if (defectDensity > 15)
    issues.push(`High design defect density (${defectDensity}%). Indicates weaknesses in architectural or design reviews.`);
  else
    positives.push(`Design defect density is healthy (${defectDensity}%). Reviews seem effective.`);

  if (reviewedComponents < Math.max(1, totalComponents * 0.7))
    issues.push(`Insufficient design components reviewed (${reviewedComponents}/${totalComponents}).`);
  else
    positives.push(`Most design components are reviewed (${reviewedComponents}/${totalComponents}). Good design governance.`);


  if (implComplexity > 12)
    issues.push(`Cyclomatic complexity is high (${implComplexity}). This affects maintainability and increases defect probability.`);
  else
    positives.push(`Cyclomatic complexity is within acceptable limits (${implComplexity}). Code structure is manageable.`);

  if (implComments < 15)
    issues.push(`Low code comment coverage (${implComments}%). Developers may struggle understanding logic.`);
  else
    positives.push(`Good commenting discipline (${implComments}%). Code clarity is being maintained.`);

  if (implQuality < 6)
    issues.push(`Code quality score is low (${implQuality}/10). Indicates potential issues in readability, structure, or code smell presence.`);
  else
    positives.push(`Strong code quality score (${implQuality}/10). Coding standards appear to be followed.`);

  if (unitCoverage < 50)
    issues.push(`Unit test coverage is low (${unitCoverage}%). Risk of regressions increases significantly.`);
  else
    positives.push(`Unit test coverage is strong (${unitCoverage}%). This improves stability and reduces regressions.`);

  if (totalDefects > 20)
    issues.push(`High defect detection rate (${totalDefects}). Indicates underlying issues in earlier phases (design or implementation).`);
  else
    positives.push(`Defects detected are within acceptable limits (${totalDefects}). Quality gates appear effective.`);

  if (uptime < 95)
    issues.push(`System uptime (${uptime}%) is below reliability standards. Availability issues need investigation.`);
  else
    positives.push(`High system uptime (${uptime}%). Deployment reliability is strong.`);

  if (csat < 6)
    issues.push(`Customer satisfaction score is low (${csat}/10). End-users are not fully satisfied with stability or usability.`);
  else
    positives.push(`High customer satisfaction (${csat}/10). Indicates strong delivery alignment with user expectations.`);

  if (bugFixRate < 70)
    issues.push(`Bug fix closure rate is weak (${bugFixRate}%). This increases backlog accumulation.`);
  else
    positives.push(`High bug resolution efficiency (${bugFixRate}%). Issues are being addressed promptly.`);

  if (avgResolveTime > 48)
    issues.push(`Average bug resolution time is high (${avgResolveTime} hrs). Slow issue resolution impacts release cycles.`);
  else
    positives.push(`Quick resolution times (${avgResolveTime} hrs). Response efficiency is strong.`);

  return (
    <div style={{ whiteSpace: "pre-line", fontSize: "15px", lineHeight: "1.55" }}>
      <strong>Areas of Concern</strong>
      {"\n"}
      {issues.length > 0 ? issues.map(i => `• ${i}`).join("\n") : "• No major issues detected."}

      {"\n\n"}
      <strong>Strengths</strong>
      {"\n"}
      {positives.length > 0 ? positives.map(p => `• ${p}`).join("\n") : "• No strong positives detected."}
    </div>
  );
};


const qualityRemark = generateDetailedQualityFeedback();


  const handleDownloadPDF = async () => {
    if (!dashboardRef.current || isDownloading) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);

      const PDFClass = typeof jsPDF === 'function' ? jsPDF : window.jsPDF;
      if (!PDFClass) {
        throw new Error("jsPDF dependency is not available.");
      }
      
      const pdf = new PDFClass('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
   
      pdf.save(`${project.name}_Quality_Report.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Check console for dependency errors.');
    } finally {
      setIsDownloading(false);
    }
  };



  const ValueDisplay = ({ label, value, color = DARK_PURPLE }) => (
    <div style={{
      textAlign: 'center',
      padding: '10px 15px',
      borderRadius: '8px',
      background: '#f8f8f8',
      flex: 1,
      minWidth: '150px'
    }}>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color }}>{value}</p>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{label}</p>
    </div>
  );

  const phaseCardStyle = {
  width: '100%',
  padding: '24px',
  borderRadius: '20px',
  marginBottom: '35px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
  background: '#ffffff',
  border: '1px solid #f0e6d8'
};

  if (loading) return <p>Loading dashboard…</p>;
  if (!project) return <p>No project found.</p>;

  return (
    <div style={{
  maxWidth: '1200px',
  margin: 'auto',
  padding: '30px',
  // background: '#f3efebff', 
  minHeight: '100vh',
  borderRadius: '16px'
}}>
      <button
  onClick={() => navigate('/projects')}
  style={{
    position: 'absolute',
    right:'30px',
    top: '20px',
    // left: '20px',
    padding: '10px 18px',
    background: '#5c14eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    transition: '0.2s',
  }}
  onMouseOver={e => (e.target.style.background = '#7d3bff')}
  onMouseOut={e => (e.target.style.background = '#5c14eb')}
>
  ← Back to Projects
</button>


      <h1 style={{
          textAlign: 'center',
          marginBottom: '6px',
          fontSize: '48px',
          fontWeight: '900',
          background: 'linear-gradient(90deg, #5c14eb, #8a4bff)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          letterSpacing: '-1px'
        }}>
          Project : {project.name}
        </h1>

        <p style={{
          textAlign: 'center',
          marginBottom: '35px',
          color: '#5b5b5b',
          fontSize: '32px',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          SDLC Quality Dashboard
        </p>


      <div ref={dashboardRef}>
      
        <div style={{ ...phaseCardStyle, background: '#e0f7fa' }}>
          <h3 style={{ color: LIGHT_BLUE }}>Overall Quality Score</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: qualityPercent >= 70 ? '#28a745' : RED_VOLATILITY
              }}>
                {qualityPercent}%
              </p>
            </div>
            <div style={{ flex: 2, padding: '10px 20px' }}>
              
              <div style={{
                  background: '#e0f9fdff',
                  padding: '20px',
                  borderRadius: '12px',
                  // border: '1px solid #5d6363ff',
                  marginTop: '0px'
                }}>
                  <p style={{ fontWeight: 'bold' }}>Review:</p>
                  {qualityRemark}
                </div>
            </div>
          </div>
        </div>
        <div style={{ ...phaseCardStyle, background: "#f0f7ff" }}>
          <h3 style={{ color: LIGHT_BLUE }}>📊 Phase-wise Quality Breakdown</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#aa89eaff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...phaseCardStyle, background: '#ffebee' }}>
          <h3 style={{ color: RED_VOLATILITY }}>📘 Requirements</h3>

          <div style={{ display: 'flex', gap: 20 }}>
            <ValueDisplay label="Volatility" value={`${dashboardData.volatilityPercent}%`} color={RED_VOLATILITY} />
            <ValueDisplay label="Ambiguity" value={`${dashboardData.ambiguityPercent}%`} color={COLORS[2]} />
            <ValueDisplay label="Review Coverage" value={`${dashboardData.reviewCoverage}%`} color={LIGHT_BLUE} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dashboardData.reqPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                labelLine={false}
                label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : null}
              >
                {dashboardData.reqPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...phaseCardStyle, background: '#fff3e0' }}>
          <h3 style={{ color: ORANGE_DEFECT }}>🎨 Design</h3>

          <div style={{ display: 'flex', gap: 20 }}>
            <ValueDisplay label="Defect Density" value={`${dashboardData.designDefectDensity}%`} color={RED_VOLATILITY} />
            <ValueDisplay label="Total Components" value={metrics.design.totalComponents} color={DARK_PURPLE} />
            <ValueDisplay label="Reviewed Components" value={metrics.design.reviewedComponents} color={LIGHT_BLUE} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              {
                name: 'Design',
                Defective: metrics.design.defectiveComponents,
                Reviewed: metrics.design.reviewedComponents
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Defective" fill={RED_VOLATILITY} />
              <Bar dataKey="Reviewed" fill={LIGHT_BLUE} />
            </BarChart>
          </ResponsiveContainer>
        </div>

     
        <div style={{ ...phaseCardStyle, background: '#e8f5e9' }}>
          <h3 style={{ color: '#28a745' }}>💻 Implementation</h3>

          <div style={{ display: 'flex', gap: 20 }}>
            <ValueDisplay label="Cyclomatic Complexity" value={dashboardData.impl.cyclomaticComplexity} color={RED_VOLATILITY} />
            <ValueDisplay label="Halstead Volume" value={dashboardData.halstead.volume} color={LIGHT_BLUE} />
            <ValueDisplay label="Halstead Difficulty" value={dashboardData.halstead.difficulty} color={ORANGE_DEFECT} />
            <ValueDisplay label="Code Quality Score" value={dashboardData.impl.codeQualityScore} color="#28a745" />
            <ValueDisplay label="Comments (%)" value={`${dashboardData.commentsPercent}%`} color={DARK_PURPLE} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardData.codeDefectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={RED_VOLATILITY} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...phaseCardStyle, background: '#fce4ec' }}>
          <h3 style={{ color: '#E91E63' }}>🧪 Testing</h3>

          <div style={{ display: 'flex', gap: 20 }}>
            <ValueDisplay label="Unit Coverage" value={`${dashboardData.unitCoverage}%`} color={LIGHT_BLUE} />
            <ValueDisplay label="Total Defects" value={dashboardData.totalDefectsFound} color={RED_VOLATILITY} />
            <ValueDisplay label="Max Users" value={dashboardData.testing?.system.maxConcurrentUsers || 0} color="#28a745" />
            <ValueDisplay label="Response Time (ms)" value={dashboardData.testing?.system.responseTime || 0} color={DARK_PURPLE} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardData.defectDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={RED_VOLATILITY} />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dashboardData.testSuccessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={LIGHT_BLUE} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...phaseCardStyle, background: '#e3f2fd' }}>
          <h3 style={{ color: LIGHT_BLUE }}>🚀 Deployment</h3>

          <div style={{ display: 'flex', gap: 20 }}>
            <ValueDisplay label="Uptime" value={`${dashboardData.deploy.uptimePercentage}%`} color="#28a745" />
            <ValueDisplay label="Avg Resolve Time (hrs)" value={dashboardData.deploy.avgTimeToResolve} color={ORANGE_DEFECT} />
            <ValueDisplay label="Bug Fix Rate" value={`${dashboardData.bugsResolvedPercent}%`} color={LIGHT_BLUE} />
            <ValueDisplay label="CSAT" value={dashboardData.deploy.customerSatisfactionScore} color={DARK_PURPLE} />
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardData.stabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={RED_VOLATILITY} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '30px',
          background: isDownloading ? '#ccc' : DARK_PURPLE,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {isDownloading ? 'Generating PDF...' : '⬇️ Download Quality Report (PDF)'}
      </button>
      
    </div>
  );
}