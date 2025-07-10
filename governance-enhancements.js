// Voting Flow Implementation for Governance Page
// Implements plasma streams between governance tiers with consensus field

// Play flow sound effect
function playFlowSound() {
    if (!audioEnabled || !synth) return;
    
    // Ascending arpeggio for flow
    const notes = ['C3', 'E3', 'G3', 'C4', 'E4'];
    let delay = 0;
    
    try {
        notes.forEach(note => {
            synth.triggerAttackRelease(note, '16n', `+${delay}`);
            delay += 0.05;
        });
    } catch (e) {
        console.log('Flow sound playback skipped');
    }
}

// Enhanced voting demonstration with flows
function initiateVotingFlowDemo() {
    // Clear existing flows
    votingFlows.forEach(flow => {
        flow.deactivate();
        if (flow.mesh) scene.remove(flow.mesh);
        flow.particles.forEach(p => scene.remove(p.mesh));
    });
    votingFlows = [];
    
    let voteCount = 0;
    let consensus = 0;
    const maxVotes = 15;
    
    // Create voting flows from different tiers
    const voteInterval = setInterval(() => {
        if (voteCount >= maxVotes) {
            clearInterval(voteInterval);
            
            // Show final consensus
            const finalConsensus = consensus / maxVotes;
            votingCore.showConsensus(finalConsensus);
            stats.consensusLevel = Math.floor(finalConsensus * 100);
            stats.energyFlow = 'Consensus Achieved';
            updateStats();
            
            // Deactivate flows after delay
            setTimeout(() => {
                votingFlows.forEach(flow => flow.deactivate());
                stats.energyFlow = 'Normal';
                updateStats();
            }, 3000);
            
            return;
        }
        
        // Select random voter
        const voter = governanceNodes[Math.floor(Math.random() * governanceNodes.length)];
        voter.activate();
        
        // Create voting flow
        const flow = new VotingFlow(voter, votingCore, voter.config.color);
        flow.activate();
        votingFlows.push(flow);
        
        // Update consensus
        voteCount++;
        consensus += Math.random() > 0.3 ? 1 : 0; // 70% positive votes
        
        // Update stats
        stats.energyFlow = 'Voting Active';
        updateStats();
        
        // Deactivate voter after delay
        setTimeout(() => voter.deactivate(), 1500);
        
    }, 500);
}

// Create enhanced proposal with voting flow
function createProposalWithFlow() {
    // Select random community member as proposer
    const communityNodes = governanceNodes.filter(n => n.tier === 2);
    const proposer = communityNodes[Math.floor(Math.random() * communityNodes.length)];
    proposer.activate();
    
    // Find path through tiers
    const technicalNodes = governanceNodes.filter(n => n.tier === 1);
    const councilNodes = governanceNodes.filter(n => n.tier === 0);
    
    const technicalReviewer = technicalNodes[Math.floor(Math.random() * technicalNodes.length)];
    const councilApprover = councilNodes[Math.floor(Math.random() * councilNodes.length)];
    
    // Create flow from proposer to technical committee
    setTimeout(() => {
        const flow1 = new VotingFlow(proposer, technicalReviewer, new THREE.Color(0x10B981));
        flow1.activate();
        votingFlows.push(flow1);
        
        // Activate technical reviewer
        setTimeout(() => {
            technicalReviewer.activate();
            proposer.deactivate();
            
            // Create flow from technical to council
            setTimeout(() => {
                const flow2 = new VotingFlow(technicalReviewer, councilApprover, new THREE.Color(0x3B82F6));
                flow2.activate();
                votingFlows.push(flow2);
                
                // Activate council
                setTimeout(() => {
                    councilApprover.activate();
                    technicalReviewer.deactivate();
                    
                    // Create flow to voting core
                    setTimeout(() => {
                        const flow3 = new VotingFlow(councilApprover, votingCore, new THREE.Color(0x8B5CF6));
                        flow3.activate();
                        votingFlows.push(flow3);
                        
                        // Show consensus
                        setTimeout(() => {
                            votingCore.showConsensus(0.5);
                            councilApprover.deactivate();
                            stats.proposalCount++;
                            stats.consensusLevel = 50;
                            updateStats();
                            
                            // Clean up flows
                            setTimeout(() => {
                                votingFlows.forEach(flow => flow.deactivate());
                            }, 2000);
                        }, 1000);
                    }, 500);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 500);
    
    stats.energyFlow = 'Proposal Active';
    updateStats();
}

// Add to voting flow update in animation loop
function updateVotingFlows(time) {
    votingFlows.forEach(flow => flow.update(time));
}

// Enhanced Network View with force-directed layout
function createNetworkView() {
    // Create force simulation data
    const nodes = governanceNodes.map(node => ({
        id: `${node.config.name}-${node.index}`,
        tier: node.tier,
        node: node,
        x: node.mesh.position.x,
        y: node.mesh.position.z,
        vx: 0,
        vy: 0
    }));
    
    // Apply force simulation
    const simulation = {
        alpha: 1,
        alphaDecay: 0.01,
        
        tick: function() {
            if (this.alpha <= 0) return;
            
            // Apply forces
            nodes.forEach((n1, i) => {
                // Repulsion between all nodes
                nodes.forEach((n2, j) => {
                    if (i === j) return;
                    
                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 0.1) return;
                    
                    const force = 50 / (dist * dist);
                    n1.vx -= dx / dist * force;
                    n1.vy -= dy / dist * force;
                });
                
                // Attraction to tier center
                const tierRadius = [8, 12, 16][n1.tier];
                const angle = (n1.node.index / n1.node.config.count) * Math.PI * 2;
                const targetX = Math.cos(angle) * tierRadius;
                const targetY = Math.sin(angle) * tierRadius;
                
                n1.vx += (targetX - n1.x) * 0.1;
                n1.vy += (targetY - n1.y) * 0.1;
                
                // Apply velocity
                n1.x += n1.vx * this.alpha;
                n1.y += n1.vy * this.alpha;
                
                // Damping
                n1.vx *= 0.9;
                n1.vy *= 0.9;
                
                // Update mesh position
                n1.node.mesh.position.x = n1.x;
                n1.node.mesh.position.z = n1.y;
            });
            
            this.alpha -= this.alphaDecay;
        }
    };
    
    // Run simulation in network view
    const networkInterval = setInterval(() => {
        if (currentView !== 'network' || simulation.alpha <= 0) {
            clearInterval(networkInterval);
            return;
        }
        simulation.tick();
    }, 16);
}

// Timeline View Implementation
function createTimelineView() {
    const timeline = [
        { year: 2024, event: "Genesis Block", tier: 0 },
        { year: 2025, event: "Protocol Launch", tier: 0 },
        { year: 2026, event: "Technical Framework", tier: 1 },
        { year: 2027, event: "Community Expansion", tier: 2 },
        { year: 2028, event: "Global Adoption", tier: 2 }
    ];
    
    // Position nodes along timeline
    timeline.forEach((event, index) => {
        const progress = index / (timeline.length - 1);
        const x = -20 + progress * 40;
        
        // Find representative node from tier
        const tierNodes = governanceNodes.filter(n => n.tier === event.tier);
        if (tierNodes.length > 0) {
            const node = tierNodes[index % tierNodes.length];
            
            gsap.to(node.mesh.position, {
                x: x,
                y: node.config.height,
                z: 0,
                duration: 2,
                delay: index * 0.2,
                ease: "power2.inOut"
            });
            
            // Activate node briefly
            setTimeout(() => {
                node.activate();
                setTimeout(() => node.deactivate(), 2000);
            }, index * 200 + 1000);
        }
    });
}

// Post-processing setup (for high/ultra quality)
function setupPostProcessing() {
    if (quality === 'low' || quality === 'medium') return;
    
    // Bloom pass for glow effects
    const bloomPass = {
        strength: 1.5,
        radius: 0.4,
        threshold: 0.85
    };
    
    // Depth of field for cinematic focus
    const dofPass = {
        focus: 20,
        aperture: 0.025,
        maxblur: 0.01
    };
    
    // Apply in render loop based on quality
    return { bloomPass, dofPass };
}

// Spatial Audio Implementation
function updateSpatialAudio() {
    if (!audioEnabled || !panner) return;
    
    // Update panner position based on camera
    try {
        const listenerPos = camera.position;
        Tone.Listener.position.set(listenerPos.x, listenerPos.y, listenerPos.z);
        
        // Update audio sources positions
        governanceNodes.forEach(node => {
            if (node.active && node.audioSource) {
                const pos = node.mesh.position;
                node.audioSource.position.set(pos.x, pos.y, pos.z);
            }
        });
    } catch (e) {
        console.log('Spatial audio update skipped');
    }
}

// Export functions for use in main governance.html
window.governanceEnhancements = {
    playFlowSound,
    initiateVotingFlowDemo,
    createProposalWithFlow,
    updateVotingFlows,
    createNetworkView,
    createTimelineView,
    setupPostProcessing,
    updateSpatialAudio
};
