/**
 * Example: Naomi Agent participating in Colosseum Agent Hackathon
 */

import { AgentManager, AnthropicProvider } from '@naomi/core';
import { ColosseumHackathonPlugin } from '../packages/core/src/plugins/ColosseumHackathonPlugin';

async function main() {
  const manager = new AgentManager();

  // Get API key from environment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  // Create Naomi agent
  const naomi = await manager.createAgent({
    id: 'naomi-hackathon',
    name: 'Naomi',
    description: 'Naomi Agent Network participant in Colosseum Hackathon',
    systemPrompt: `You are Naomi, an AI agent participating in the Colosseum Agent Hackathon.
    Your goal is to build a real project on Solana that solves a genuine problem.
    You should:
    1. Register for the hackathon
    2. Explore the forum to find teammates and ideas
    3. Build something meaningful on Solana
    4. Engage with the community
    5. Submit your project when ready.`
  });

  naomi.setModelProvider(new AnthropicProvider(apiKey));

  // Register Colosseum Hackathon plugin
  const hackathonPlugin = new ColosseumHackathonPlugin();
  naomi.registerPlugin(hackathonPlugin);

  console.log('🚀 Naomi is ready to join the Colosseum Hackathon!\n');

  // Step 1: Register for the hackathon
  console.log('📝 Step 1: Registering for hackathon...');
  try {
    const registration = await hackathonPlugin.execute(naomi, {
      action: 'register',
      name: 'naomi-agent-network'
    });
    
    console.log('✅ Registered successfully!');
    console.log(`   Agent ID: ${registration.agent.id}`);
    console.log(`   Claim Code: ${registration.claimCode}`);
    console.log(`   ⚠️  API Key: ${registration.agent.apiKey ? 'SAVED' : 'NOT SAVED'}`);
    console.log(`   Claim URL: ${registration.claimUrl}\n`);

    // Save API key for future use
    if (registration.agent.apiKey) {
      hackathonPlugin.setApiKey(registration.agent.apiKey);
    }
  } catch (error) {
    console.error('❌ Registration failed:', error);
    return;
  }

  // Step 2: Get status and next steps
  console.log('📊 Step 2: Getting status...');
  try {
    const status = await hackathonPlugin.execute(naomi, { action: 'getStatus' });
    console.log('✅ Status retrieved:');
    console.log(`   Hackathon: ${status.hackathon?.name || 'N/A'}`);
    console.log(`   Status: ${status.agent?.status || 'N/A'}`);
    if (status.nextSteps) {
      console.log(`   Next Steps: ${status.nextSteps.join(', ')}`);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Failed to get status:', error);
  }

  // Step 3: Explore forum for ideas and teammates
  console.log('🔍 Step 3: Exploring forum for ideas...');
  try {
    const posts = await hackathonPlugin.execute(naomi, {
      action: 'listForumPosts',
      options: {
        sort: 'hot',
        limit: 10,
        tags: ['ideation', 'team-formation']
      }
    });
    
    console.log(`✅ Found ${posts.posts?.length || 0} posts`);
    if (posts.posts && posts.posts.length > 0) {
      console.log('   Top posts:');
      posts.posts.slice(0, 3).forEach((post: any, i: number) => {
        console.log(`   ${i + 1}. ${post.title} (${post.upvotes} upvotes)`);
      });
    }
    console.log('');
  } catch (error) {
    console.error('❌ Failed to explore forum:', error);
  }

  // Step 4: Get heartbeat for periodic sync
  console.log('💓 Step 4: Getting heartbeat checklist...');
  try {
    const heartbeat = await hackathonPlugin.execute(naomi, { action: 'getHeartbeat' });
    console.log('✅ Heartbeat retrieved');
    console.log('   Use this for periodic syncing (every ~30 minutes)');
    console.log(`   URL: ${heartbeat.url}\n`);
  } catch (error) {
    console.error('❌ Failed to get heartbeat:', error);
  }

  // Step 5: Create a project (example - customize based on your idea)
  console.log('🏗️  Step 5: Ready to create project...');
  console.log('   To create a project, use:');
  console.log(`
    await hackathonPlugin.execute(naomi, {
      action: 'createProject',
      project: {
        name: "Your Project Name",
        description: "What your project does",
        repoLink: "https://github.com/your-org/your-repo",
        solanaIntegration: "How you use Solana",
        tags: ["defi", "ai"]
      }
    });
  `);

  console.log('\n🎯 Next steps:');
  console.log('   1. Explore the forum to find teammates and ideas');
  console.log('   2. Build your Solana project');
  console.log('   3. Create and update your project as you build');
  console.log('   4. Engage with the community');
  console.log('   5. Submit when ready (project will be locked after submission)');
  console.log('\n💡 Remember: Build something real that solves a problem!');
}

main().catch(console.error);

