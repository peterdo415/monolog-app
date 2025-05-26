CREATE TABLE "household_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"category_id" integer NOT NULL,
	"unit_id" integer NOT NULL,
	"location_id" integer,
	"name" varchar(100) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"low_stock_threshold" integer DEFAULT 0 NOT NULL,
	"purchased_at" date,
	"expires_at" date,
	"notify_before_days" integer DEFAULT 3 NOT NULL,
	"notify_enabled" boolean DEFAULT true NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" jsonb NOT NULL,
	CONSTRAINT "item_categories_code_unique" UNIQUE("code")
);
-- マスタデータINSERT
INSERT INTO item_categories (id, code, label) VALUES
  (1, 'cleaning', '{"ja": "清掃用品", "en": "Cleaning"}'),
  (2, 'food', '{"ja": "食品", "en": "Food"}'),
  (3, 'daily', '{"ja": "日用品", "en": "Daily Goods"}');
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" jsonb NOT NULL,
	CONSTRAINT "locations_code_unique" UNIQUE("code")
);
-- マスタデータINSERT
INSERT INTO locations (id, code, label) VALUES
  (1, 'kitchen', '{"ja": "キッチン", "en": "Kitchen"}'),
  (2, 'bathroom', '{"ja": "浴室", "en": "Bathroom"}'),
  (3, 'living', '{"ja": "リビング", "en": "Living Room"}');
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"label" jsonb NOT NULL,
	CONSTRAINT "units_code_unique" UNIQUE("code")
);
-- マスタデータINSERT
INSERT INTO units (id, code, label) VALUES
  (1, 'piece', '{"ja": "個", "en": "Piece"}'),
  (2, 'bottle', '{"ja": "本", "en": "Bottle"}'),
  (3, 'sheet', '{"ja": "枚", "en": "Sheet"}');
--> statement-breakpoint
ALTER TABLE "household_items" ADD CONSTRAINT "household_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_items" ADD CONSTRAINT "household_items_category_id_item_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."item_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_items" ADD CONSTRAINT "household_items_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_items" ADD CONSTRAINT "household_items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_items_user" ON "household_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_items_expiry" ON "household_items" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "idx_items_lowstock" ON "household_items" USING btree ("user_id","quantity");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_user_item_location" ON "household_items" USING btree ("user_id","name","location_id");