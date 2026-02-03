CREATE TABLE "article_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"tag_category" text NOT NULL,
	"tag_value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"question_key" text NOT NULL,
	"question_text" text NOT NULL,
	"answer_value" text NOT NULL,
	"answer_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completion_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plant_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"common_name" text NOT NULL,
	"description" text,
	"quorum_sensing_role" text,
	"microbiome_benefits" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "plant_families_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_id" uuid NOT NULL,
	"name" text NOT NULL,
	"scientific_name" text,
	"common_names" text[],
	"difficulty" text NOT NULL,
	"climate_adaptability" text,
	"temperature_preference" text,
	"soil_temp_min" integer,
	"soil_temp_max" integer,
	"frost_tolerance" integer,
	"beneficial_microbes" text[],
	"endophyte_richness" text,
	"quorum_sensing_contribution" text,
	"fermentation_potential" text,
	"air_filtration_capacity" text,
	"pollutants_filtered" text[],
	"beneficial_animals" text[],
	"common_pests" text[],
	"organic_pest_management" text,
	"dog_safe" boolean DEFAULT true,
	"cat_safe" boolean DEFAULT true,
	"chicken_compatible" boolean DEFAULT true,
	"dog_microbe_transfer" text,
	"companion_families" uuid[],
	"space_requirements" text,
	"brix_target_min" numeric(4, 2),
	"brix_target_max" numeric(4, 2),
	"heritage_varieties" text[],
	"seed_sources" text,
	"autoinducer_guidance" text,
	"foliar_feed_protocol" text,
	"nutrient_data_source" text,
	"nutrient_data_confidence" text,
	"featured_indoor_air_quality" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"title" text NOT NULL,
	"authors" text[],
	"journal" text,
	"publication_date" date,
	"doi" text,
	"source_url" text,
	"summary" text,
	"key_findings" text,
	"garden_relevance" text,
	"pinned" boolean DEFAULT false NOT NULL,
	"tier_access" text DEFAULT 'free' NOT NULL,
	"admin_approved" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"bookmark_count" integer DEFAULT 0 NOT NULL,
	"imported_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_health_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"health_goal" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_health_goals_user_goal_unique" UNIQUE("user_id","health_goal")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location_city" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location_country" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location_coordinates" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hemisphere" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "climate_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hardiness_zone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "average_frost_dates" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "soil_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "space_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "space_size" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "constraints" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "has_structures" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "experience_level" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "learning_preference" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pets" text[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_tier" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" text;--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_research_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."research_articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_family_id_plant_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."plant_families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_articles" ADD CONSTRAINT "research_articles_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_articles" ADD CONSTRAINT "research_articles_imported_by_users_id_fk" FOREIGN KEY ("imported_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_health_goals" ADD CONSTRAINT "user_health_goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_tags_article_idx" ON "article_tags" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_tags_category_value_idx" ON "article_tags" USING btree ("tag_category","tag_value");--> statement-breakpoint
CREATE INDEX "article_tags_value_idx" ON "article_tags" USING btree ("tag_value");--> statement-breakpoint
CREATE INDEX "assessment_responses_assessment_idx" ON "assessment_responses" USING btree ("assessment_id");--> statement-breakpoint
CREATE INDEX "assessment_responses_user_idx" ON "assessment_responses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assessment_responses_question_key_idx" ON "assessment_responses" USING btree ("question_key");--> statement-breakpoint
CREATE INDEX "assessment_responses_question_answer_idx" ON "assessment_responses" USING btree ("question_key","answer_value");--> statement-breakpoint
CREATE INDEX "assessments_user_idx" ON "assessments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assessments_completed_idx" ON "assessments" USING btree ("completed");--> statement-breakpoint
CREATE INDEX "plants_family_idx" ON "plants" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "plants_difficulty_idx" ON "plants" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "plants_climate_idx" ON "plants" USING btree ("climate_adaptability");--> statement-breakpoint
CREATE INDEX "plants_featured_air_quality_idx" ON "plants" USING btree ("featured_indoor_air_quality");--> statement-breakpoint
CREATE INDEX "research_articles_document_idx" ON "research_articles" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "research_articles_pinned_idx" ON "research_articles" USING btree ("pinned");--> statement-breakpoint
CREATE INDEX "research_articles_tier_access_idx" ON "research_articles" USING btree ("tier_access");--> statement-breakpoint
CREATE INDEX "research_articles_publication_date_idx" ON "research_articles" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "research_articles_admin_approved_idx" ON "research_articles" USING btree ("admin_approved");--> statement-breakpoint
CREATE INDEX "user_health_goals_user_idx" ON "user_health_goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_health_goals_goal_idx" ON "user_health_goals" USING btree ("health_goal");--> statement-breakpoint
CREATE INDEX "user_health_goals_primary_idx" ON "user_health_goals" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "subscription_tier_idx" ON "users" USING btree ("subscription_tier");--> statement-breakpoint
CREATE INDEX "climate_type_idx" ON "users" USING btree ("climate_type");--> statement-breakpoint
CREATE INDEX "hemisphere_idx" ON "users" USING btree ("hemisphere");