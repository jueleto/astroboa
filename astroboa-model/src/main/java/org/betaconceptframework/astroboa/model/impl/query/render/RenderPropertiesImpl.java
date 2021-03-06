/*
 * Copyright (C) 2005-2012 BetaCONCEPT Limited
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.betaconceptframework.astroboa.model.impl.query.render;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.betaconceptframework.astroboa.api.model.query.render.RenderInstruction;
import org.betaconceptframework.astroboa.api.model.query.render.RenderProperties;

/**
 * Instructions on how to render Content Object results
 * 
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
public class RenderPropertiesImpl implements RenderProperties, Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7532677351816292914L
	;
	private Map<RenderInstruction, Object> renderInstructions= new HashMap<RenderInstruction, Object>();
	
	public Map<RenderInstruction, Object> getRenderInstructions() {
		return renderInstructions;
	}

	public void resetRenderInstructions() {
		renderInstructions.clear();
	}

	@Override
	public boolean allContentObjectPropertiesAreRendered() {
		return BooleanUtils.isTrue((Boolean) renderInstructions.get(RenderInstruction.DISABLE_LAZY_LOADING_OF_CONTENT_OBJECT_PROPERTIES));
	}

	@Override
	public String getVersionUsedToRender() {
		return (String) renderInstructions.get(RenderInstruction.CONTENT_OBJECT_VERSION);
	}

	@Override
	public boolean isParentEntityRendered() {
		return BooleanUtils.isTrue((Boolean) renderInstructions.get(RenderInstruction.RENDER_PARENT));
	}

	@Override
	public void renderAllContentObjectProperties(
			boolean renderAllContentObjectProperties) {
			renderInstructions.put(RenderInstruction.DISABLE_LAZY_LOADING_OF_CONTENT_OBJECT_PROPERTIES, renderAllContentObjectProperties);
	}

	@Override
	public void renderParentEntity(boolean renderParent) {
		renderInstructions.put(RenderInstruction.RENDER_PARENT, renderParent);
	}

	@Override
	public void renderVersionForContentObject(String versionName) {
		if (StringUtils.isNotBlank(versionName)){
			renderInstructions.put(RenderInstruction.CONTENT_OBJECT_VERSION, versionName);
		}
		
	}

	@Override
	public boolean areSerializeContentObjectsUsingTheSameNameAsCollectionItemName() {
		return BooleanUtils.isTrue((Boolean) renderInstructions.get(RenderInstruction.SERIALIZE_OBJECTS_USING_THE_SAME_NAME_FOR_EACH_COLLECTION_ITEM));
	}

	@Override
	public void serializeContentObjectsUsingTheSameNameAsCollectionItemName(
			boolean exportContentObjectsWithSameElementName) {
		renderInstructions.put(RenderInstruction.SERIALIZE_OBJECTS_USING_THE_SAME_NAME_FOR_EACH_COLLECTION_ITEM, exportContentObjectsWithSameElementName);
		
	}

	@Override
	public boolean isPrettyPrintEnabled() {
		return BooleanUtils.isTrue((Boolean) renderInstructions.get(RenderInstruction.PRETTY_PRINT));
	}

	@Override
	public void prettyPrint(boolean enable) {
		renderInstructions.put(RenderInstruction.PRETTY_PRINT, enable);
	}
}
